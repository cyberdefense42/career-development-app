import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db, googleProvider, facebookProvider, twitterProvider } from '../config/firebase';
import Logger from '../utils/logger';
import { validateEmail, validatePassword, validateAssessmentData, createRateLimiter } from '../utils/validation';
// Use demo or real Firebase based on environment
const isDevelopment = process.env.NODE_ENV === 'development' && !process.env.REACT_APP_FIREBASE_API_KEY;

let authImports, firestoreImports;

if (isDevelopment) {
  const demoFirebase = require('../config/firebase-demo');
  authImports = {
    signInWithEmailAndPassword: demoFirebase.signInWithEmailAndPassword,
    createUserWithEmailAndPassword: demoFirebase.createUserWithEmailAndPassword,
    signInWithPopup: demoFirebase.signInWithPopup,
    signOut: demoFirebase.signOut,
    onAuthStateChanged: demoFirebase.onAuthStateChanged,
    updateProfile: demoFirebase.updateProfile
  };
  firestoreImports = {
    doc: demoFirebase.doc,
    setDoc: demoFirebase.setDoc,
    getDoc: demoFirebase.getDoc,
    collection: demoFirebase.collection,
    addDoc: demoFirebase.addDoc,
    getDocs: demoFirebase.getDocs,
    query: demoFirebase.query,
    where: demoFirebase.where
  };
} else {
  authImports = require('firebase/auth');
  firestoreImports = require('firebase/firestore');
}

const {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile
} = authImports;

const { doc, setDoc, getDoc, collection, addDoc, getDocs, query, where } = firestoreImports;

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Rate limiters for authentication attempts
  const loginRateLimiter = createRateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes
  const signupRateLimiter = createRateLimiter(3, 60 * 60 * 1000); // 3 attempts per hour

  // Auth state listener
  useEffect(() => {
    Logger.debug('AuthContext: Setting up auth state listener');
    setLoading(true);
    
    // Safety timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      Logger.warn('AuthContext: Loading timeout - forcing loading to false');
      setLoading(false);
      setUser(null); // Ensure user is null if loading times out
    }, 3000); // 3 second timeout
    
    try {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        Logger.debug('AuthContext: Auth state changed:', user ? `User logged in: ${user.email}` : 'No user');
        clearTimeout(loadingTimeout); // Clear timeout since auth state changed
        
        try {
          if (user) {
            Logger.debug('AuthContext: User found, setting user state...');
            setUser(user);
            // Create user document in background, don't block on it
            createUserDocument(user).catch(error => {
              Logger.error('AuthContext: Background user document creation failed:', error);
            });
            Logger.debug('AuthContext: User set successfully');
          } else {
            setUser(null);
            Logger.debug('AuthContext: User set to null');
          }
        } catch (error) {
          Logger.error('AuthContext: Error in auth state change:', error);
          setError('Authentication error occurred');
        } finally {
          setLoading(false);
          Logger.debug('AuthContext: Loading set to false');
        }
      });

      return () => {
        clearTimeout(loadingTimeout);
        unsubscribe();
      };
    } catch (error) {
      Logger.error('AuthContext: Error setting up auth listener:', error);
      clearTimeout(loadingTimeout);
      setLoading(false);
      setUser(null);
      setError('Failed to initialize authentication');
      
      // Return empty cleanup function
      return () => {
        clearTimeout(loadingTimeout);
      };
    }
  }, []);

  // Create user document in Firestore with security measures
  const createUserDocument = async (user) => {
    if (!user || !user.uid) return;

    try {
      // Check if Firestore is available
      if (!db) {
        Logger.debug('AuthContext: Firestore not available, skipping user document creation');
        return;
      }
      
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const { displayName, email, photoURL } = user;
        const createdAt = new Date();

        // Sanitize user data
        const sanitizedDisplayName = displayName 
          ? displayName.trim().substring(0, 50).replace(/[<>]/g, '') 
          : email?.split('@')[0] || 'User';

        await setDoc(userRef, {
          displayName: sanitizedDisplayName,
          email: email || '',
          photoURL: photoURL || null,
          createdAt,
          lastLoginAt: createdAt,
          assessmentsCount: 0,
          isActive: true
        });
        Logger.debug('AuthContext: User document created successfully');
      } else {
        // Update last login time
        await setDoc(userRef, {
          lastLoginAt: new Date()
        }, { merge: true });
        Logger.debug('AuthContext: User document updated successfully');
      }
    } catch (error) {
      Logger.error('AuthContext: Error in createUserDocument:', error);
      // Don't throw the error, just log it so auth doesn't break
    }
  };

  // Email/Password signup with validation and rate limiting
  const signup = async (email, password, displayName) => {
    // Input validation
    if (!validateEmail(email)) {
      const error = new Error('Please enter a valid email address');
      setError(error.message);
      throw error;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      const error = new Error(passwordValidation.message);
      setError(error.message);
      throw error;
    }

    // Rate limiting
    const rateLimitResult = signupRateLimiter(email);
    if (!rateLimitResult.allowed) {
      const error = new Error('Too many signup attempts. Please try again later.');
      setError(error.message);
      throw error;
    }

    try {
      setError(null);
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      if (displayName && displayName.trim()) {
        const sanitizedDisplayName = displayName.trim().substring(0, 50); // Limit length
        await updateProfile(user, { displayName: sanitizedDisplayName });
      }
      
      await createUserDocument(user);
      return user;
    } catch (error) {
      Logger.error('AuthContext: Signup error:', error.code);
      // Provide user-friendly error messages
      let userMessage = 'Failed to create account';
      if (error.code === 'auth/email-already-in-use') {
        userMessage = 'An account with this email already exists';
      } else if (error.code === 'auth/weak-password') {
        userMessage = 'Password is too weak. Please choose a stronger password';
      } else if (error.code === 'auth/network-request-failed') {
        userMessage = 'Network error. Please check your connection and try again';
      }
      setError(userMessage);
      throw new Error(userMessage);
    }
  };

  // Email/Password login with validation and rate limiting
  const login = async (email, password) => {
    // Input validation
    if (!validateEmail(email)) {
      const error = new Error('Please enter a valid email address');
      setError(error.message);
      throw error;
    }

    if (!password || password.length < 1) {
      const error = new Error('Password is required');
      setError(error.message);
      throw error;
    }

    // Rate limiting
    const rateLimitResult = loginRateLimiter(email);
    if (!rateLimitResult.allowed) {
      const error = new Error('Too many login attempts. Please try again later.');
      setError(error.message);
      throw error;
    }

    try {
      setError(null);
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      return user;
    } catch (error) {
      Logger.error('AuthContext: Login error:', error.code);
      // Provide user-friendly error messages without revealing system details
      let userMessage = 'Login failed';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        userMessage = 'Invalid email or password';
      } else if (error.code === 'auth/too-many-requests') {
        userMessage = 'Too many failed attempts. Please try again later';
      } else if (error.code === 'auth/network-request-failed') {
        userMessage = 'Network error. Please check your connection and try again';
      }
      setError(userMessage);
      throw new Error(userMessage);
    }
  };

  // Google login
  const loginWithGoogle = async () => {
    try {
      setError(null);
      const { user } = await signInWithPopup(auth, googleProvider);
      await createUserDocument(user);
      return user;
    } catch (error) {
      Logger.error('AuthContext: Google login error:', error.code);
      let userMessage = 'Failed to sign in with Google';
      if (error.code === 'auth/popup-closed-by-user') {
        userMessage = 'Sign-in cancelled';
      } else if (error.code === 'auth/network-request-failed') {
        userMessage = 'Network error. Please check your connection and try again';
      }
      setError(userMessage);
      throw new Error(userMessage);
    }
  };

  // Facebook login
  const loginWithFacebook = async () => {
    try {
      setError(null);
      const { user } = await signInWithPopup(auth, facebookProvider);
      await createUserDocument(user);
      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Twitter login
  const loginWithTwitter = async () => {
    try {
      setError(null);
      const { user } = await signInWithPopup(auth, twitterProvider);
      await createUserDocument(user);
      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Save assessment data with validation
  const saveAssessment = async (assessmentData) => {
    if (!user) {
      Logger.error('AuthContext: User not authenticated for saveAssessment');
      throw new Error('User not authenticated');
    }

    try {
      // Validate and sanitize assessment data
      const sanitizedData = {
        ...assessmentData,
        assessmentData: validateAssessmentData(assessmentData.assessmentData || {})
      };

      // Additional security: Ensure user data matches authenticated user
      sanitizedData.userId = user.uid;
      sanitizedData.userEmail = user.email;
      sanitizedData.userName = user.displayName || user.email?.split('@')[0] || 'Anonymous';
      sanitizedData.createdAt = new Date();
      sanitizedData.version = '1.0';

      const assessmentRef = await addDoc(collection(db, 'assessments'), sanitizedData);

      // Update user's assessment count
      const userRef = doc(db, 'users', user.uid);
      
      try {
        const userDoc = await getDoc(userRef);
        const currentCount = userDoc.exists() ? (userDoc.data()?.assessmentsCount || 0) : 0;
        
        // Validate count doesn't exceed reasonable limits (prevent abuse)
        if (currentCount < 1000) {
          await setDoc(userRef, {
            assessmentsCount: currentCount + 1,
            lastAssessmentAt: new Date()
          }, { merge: true });
        }
      } catch (userError) {
        Logger.warn('AuthContext: Failed to update user count, but assessment saved:', userError);
        // Don't throw here, assessment is still saved
      }

      Logger.debug('AuthContext: Assessment saved successfully');
      return assessmentRef.id;
    } catch (error) {
      Logger.error('AuthContext: Error saving assessment:', error);
      throw new Error('Failed to save assessment. Please try again.');
    }
  };

  // Get user's assessments with security validation
  const getUserAssessments = async () => {
    if (!user || !user.uid) return [];

    try {
      const q = query(
        collection(db, 'assessments'),
        where('userId', '==', user.uid)
      );
      const querySnapshot = await getDocs(q);
      
      const assessments = querySnapshot.docs
        .map(doc => {
          const data = doc.data();
          // Validate that the assessment actually belongs to the current user
          if (data.userId !== user.uid) {
            Logger.warn('AuthContext: Assessment user ID mismatch, skipping');
            return null;
          }
          return {
            id: doc.id,
            ...data
          };
        })
        .filter(Boolean) // Remove null entries
        .sort((a, b) => {
          const aDate = a.completedAt?.toDate ? a.completedAt.toDate() : new Date(a.completedAt);
          const bDate = b.completedAt?.toDate ? b.completedAt.toDate() : new Date(b.completedAt);
          return bDate - aDate;
        });
      
      return assessments;
    } catch (error) {
      Logger.error('Error fetching assessments:', error);
      return [];
    }
  };

  // Get user profile with validation
  const getUserProfile = async () => {
    if (!user || !user.uid) return null;

    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const profileData = userSnap.data();
        // Additional security check: ensure profile belongs to authenticated user
        if (userSnap.id === user.uid) {
          return { id: userSnap.id, ...profileData };
        } else {
          Logger.warn('AuthContext: Profile ID mismatch');
          return null;
        }
      }
      return null;
    } catch (error) {
      Logger.error('Error fetching user profile:', error);
      return null;
    }
  };

  const value = {
    user,
    loading,
    error,
    signup,
    login,
    loginWithGoogle,
    loginWithFacebook,
    loginWithTwitter,
    logout,
    saveAssessment,
    getUserAssessments,
    getUserProfile,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
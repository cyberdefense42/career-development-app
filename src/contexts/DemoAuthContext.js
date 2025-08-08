import React, { createContext, useContext, useState, useEffect } from 'react';
import Logger from '../utils/logger';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for demo user in localStorage
    const demoUser = localStorage.getItem('demoUser');
    if (demoUser) {
      setUser(JSON.parse(demoUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const loginAsDemo = () => {
    const demoUser = {
      id: 'demo-user',
      email: 'demo@example.com',
      firstName: 'Demo',
      lastName: 'User',
      authType: 'demo'
    };
    
    localStorage.setItem('demoUser', JSON.stringify(demoUser));
    setUser(demoUser);
    setIsAuthenticated(true);
    
    Logger.info('Demo user logged in');
    return { success: true, user: demoUser };
  };

  const login = async () => {
    return { 
      success: false, 
      error: 'Demo mode - use Demo Login button instead' 
    };
  };

  const register = async () => {
    return { 
      success: false, 
      error: 'Demo mode - use Demo Login button instead' 
    };
  };

  const loginWithGoogle = async () => {
    return { 
      success: false, 
      error: 'Demo mode - Firebase not configured' 
    };
  };

  const loginWithFacebook = async () => {
    return { 
      success: false, 
      error: 'Demo mode - Firebase not configured' 
    };
  };

  const loginWithTwitter = async () => {
    return { 
      success: false, 
      error: 'Demo mode - Firebase not configured' 
    };
  };

  const logout = () => {
    localStorage.removeItem('demoUser');
    localStorage.removeItem('userProgress');
    setUser(null);
    setIsAuthenticated(false);
    Logger.info('Demo user logged out');
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    loginWithGoogle,
    loginWithFacebook,
    loginWithTwitter,
    logout,
    loginAsDemo
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
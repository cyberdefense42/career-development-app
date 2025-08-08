import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Calendar, TrendingUp, BarChart3, 
  Eye, Download, Clock, Brain, LogOut,
  Award, Target, Sparkles
} from 'lucide-react';
import { useAuth } from '../../contexts/DemoAuthContext';
import Logger from '../../utils/logger';

const DashboardPage = ({ onStartNewAssessment }) => {
  const { user, logout, getUserAssessments, getUserProfile } = useAuth();
  const [assessments, setAssessments] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  useEffect(() => {
    // Add timeout to prevent infinite loading
    const loadTimeout = setTimeout(() => {
      Logger.warn('Dashboard: Loading timeout - forcing loading to false');
      setLoading(false);
      setAssessments([]);
      setUserProfile(null);
    }, 10000); // 10 second timeout

    loadDashboardData().finally(() => {
      clearTimeout(loadTimeout);
    });

    return () => clearTimeout(loadTimeout);
  }, []);

  const loadDashboardData = async () => {
    try {
      Logger.debug('Dashboard: Starting to load data...');
      setLoading(true);
      
      Logger.debug('Dashboard: Fetching assessments and profile...');
      const [assessmentsData, profileData] = await Promise.all([
        getUserAssessments().catch(error => {
          Logger.error('Dashboard: Error loading assessments:', error);
          return []; // Return empty array on error
        }),
        getUserProfile().catch(error => {
          Logger.error('Dashboard: Error loading profile:', error);
          return null; // Return null on error
        })
      ]);
      
      Logger.info('Dashboard: Data loaded successfully', { assessmentsData, profileData });
      setAssessments(assessmentsData);
      setUserProfile(profileData);
    } catch (error) {
      Logger.error('Dashboard: Error loading dashboard data:', error);
      // Set default values on error
      setAssessments([]);
      setUserProfile(null);
    } finally {
      setLoading(false);
      Logger.debug('Dashboard: Loading complete');
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTopArchetype = (assessmentData) => {
    try {
      if (!assessmentData?.dreamJob?.selectedArchetypes?.length) {
        return 'Not determined';
      }
      const archetype = assessmentData.dreamJob.selectedArchetypes[0];
      // Handle both string and object archetypes
      if (typeof archetype === 'string') {
        return archetype;
      } else if (archetype?.name) {
        return archetype.name;
      }
      return 'Not determined';
    } catch (error) {
      Logger.error('Error getting top archetype:', error);
      return 'Not determined';
    }
  };

  const getAssessmentProgress = (assessmentData) => {
    if (!assessmentData) return 0;
    
    const sections = [
      'fiveWhyProblems',
      'workTasks', 
      'workRequirements',
      'values',
      'wheelOfLife',
      'strengths',
      'dreamJob'
    ];
    
    let completed = 0;
    sections.forEach(section => {
      if (assessmentData[section] && 
          ((Array.isArray(assessmentData[section]) && assessmentData[section].length > 0) ||
           (typeof assessmentData[section] === 'object' && Object.keys(assessmentData[section]).length > 0))) {
        completed++;
      }
    });
    
    const percentage = Math.round((completed / sections.length) * 100);
    return Math.min(percentage, 100); // Ensure never exceeds 100%
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      Logger.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Brain className="text-white" size={32} />
          </div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                <Brain className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">YOULEMENT Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, {user?.displayName || 'User'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <LogOut size={18} className="mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                <User className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Profile</p>
                <p className="text-lg font-semibold text-gray-900">{user?.displayName || 'User'}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                <BarChart3 className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Assessments</p>
                <p className="text-lg font-semibold text-gray-900">{assessments.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                <Calendar className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="text-lg font-semibold text-gray-900">
                  {userProfile?.createdAt ? formatDate(userProfile.createdAt).split(',')[0] : 'Recently'}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mr-4">
                <Award className="text-amber-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Latest Archetype</p>
                <p className="text-lg font-semibold text-gray-900">
                  {assessments.length > 0 ? getTopArchetype(assessments[0].assessmentData) : 'None'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onStartNewAssessment('new')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
          >
            <Brain className="mr-2" size={20} />
            Start New Assessment
          </motion.button>
          
          {assessments.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:border-blue-600 hover:text-blue-600 transition-all flex items-center justify-center"
            >
              <Download className="mr-2" size={20} />
              Export All Data
            </motion.button>
          )}
        </div>

        {/* Assessment History */}
        <div className="bg-white rounded-2xl shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Assessment History</h2>
            <p className="text-gray-600">Track your career development journey over time</p>
          </div>

          {assessments.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Brain className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Assessments Yet</h3>
              <p className="text-gray-600 mb-6">
                Start your first assessment to begin your career development journey.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onStartNewAssessment('new')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold"
              >
                Take Your First Assessment
              </motion.button>
            </div>
          ) : (
            <div className="p-6">
              <div className="space-y-4">
                {assessments.map((assessment, index) => {
                  try {
                    const progress = getAssessmentProgress(assessment?.assessmentData);
                    const topArchetype = getTopArchetype(assessment?.assessmentData);
                  
                  return (
                    <motion.div
                      key={assessment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                            <Brain className="text-white" size={24} />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              Assessment #{assessments.length - index}
                            </h3>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock size={14} className="mr-1" />
                              {formatDate(assessment.completedAt)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="flex items-center">
                              <TrendingUp size={16} className="text-green-500 mr-1" />
                              <span className="text-sm font-medium text-green-600">{progress}% Complete</span>
                            </div>
                            <div className="flex items-center">
                              <Target size={16} className="text-purple-500 mr-1" />
                              <span className="text-sm text-gray-600">{topArchetype}</span>
                            </div>
                          </div>
                          
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedAssessment(assessment)}
                            className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center"
                          >
                            <Eye size={16} className="mr-2" />
                            View
                          </motion.button>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mt-4">
                        <div className="bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                  } catch (error) {
                    Logger.error('Error rendering assessment:', error, assessment);
                    return (
                      <div key={assessment?.id || index} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600">Error loading assessment #{index + 1}</p>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          )}
        </div>

        {/* Assessment Detail Modal */}
        {selectedAssessment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Assessment Details</h2>
                  <button
                    onClick={() => setSelectedAssessment(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-gray-600">Completed on {formatDate(selectedAssessment.completedAt)}</p>
              </div>
              
              <div className="p-6">
                {/* Add detailed assessment view here */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Sparkles className="mr-2 text-purple-500" size={20} />
                      Key Insights
                    </h3>
                    <div className="space-y-2">
                      <p><strong>Top Values:</strong> {selectedAssessment.assessmentData?.values?.top5?.join(', ') || 'Not completed'}</p>
                      <p><strong>Career Archetype:</strong> {getTopArchetype(selectedAssessment.assessmentData)}</p>
                      <p><strong>Completion:</strong> {getAssessmentProgress(selectedAssessment.assessmentData)}%</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <BarChart3 className="mr-2 text-blue-500" size={20} />
                      Assessment Sections
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>5-Why Analysis</span>
                        <span className={selectedAssessment.assessmentData?.fiveWhyProblems?.length > 0 ? 'text-green-600' : 'text-gray-400'}>
                          {selectedAssessment.assessmentData?.fiveWhyProblems?.length > 0 ? '✓' : '○'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Work Tasks</span>
                        <span className={selectedAssessment.assessmentData?.workTasks?.length > 0 ? 'text-green-600' : 'text-gray-400'}>
                          {selectedAssessment.assessmentData?.workTasks?.length > 0 ? '✓' : '○'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Values Mapping</span>
                        <span className={selectedAssessment.assessmentData?.values?.top5?.length > 0 ? 'text-green-600' : 'text-gray-400'}>
                          {selectedAssessment.assessmentData?.values?.top5?.length > 0 ? '✓' : '○'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dream Job Discovery</span>
                        <span className={selectedAssessment.assessmentData?.dreamJob ? 'text-green-600' : 'text-gray-400'}>
                          {selectedAssessment.assessmentData?.dreamJob ? '✓' : '○'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedAssessment(null)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Close
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      // Open full assessment view with historical data
                      onStartNewAssessment('view', selectedAssessment);
                      setSelectedAssessment(null);
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    View Full Assessment
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
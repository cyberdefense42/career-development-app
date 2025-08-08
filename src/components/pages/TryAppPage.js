import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/DemoAuthContext';
import Logger from '../../utils/logger';
import CareerDevelopmentApp from '../CareerDevelopmentApp';
import LoginPage from '../auth/LoginPage';
import SignupPage from '../auth/SignupPage';
import DashboardPage from './DashboardPage';

const TryAppPage = () => {
  const { user, loading } = useAuth();
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [showAssessment, setShowAssessment] = useState(false);
  const [assessmentMode, setAssessmentMode] = useState('new'); // 'new', 'continue', 'view'
  const [historicalData, setHistoricalData] = useState(null);

  // Debug logging
  Logger.debug('TryAppPage State:', { user: !!user, loading, userEmail: user?.email });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-white border-t-transparent rounded-full"
            />
          </div>
          <p className="text-gray-600">Loading authentication...</p>
          <p className="text-sm text-gray-400 mt-2">This should only take a few seconds</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show login/signup
  if (!user) {
    if (authMode === 'signup') {
      return (
        <SignupPage 
          onSwitchToLogin={() => setAuthMode('login')}
          onClose={() => {}} 
        />
      );
    }
    return (
      <LoginPage 
        onSwitchToSignup={() => setAuthMode('signup')}
        onClose={() => {}} 
      />
    );
  }

  // If user wants to take assessment, show assessment
  if (showAssessment) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-white"
            >
              <h1 className="text-4xl font-bold mb-4">
                Career Assessment
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Discover your unique career archetype with AI-powered insights
              </p>
            </motion.div>
          </div>
        </section>

        {/* App Container */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <CareerDevelopmentApp 
                onBackToDashboard={() => setShowAssessment(false)} 
                mode={assessmentMode}
                historicalData={historicalData}
              />
            </motion.div>
          </div>
        </section>
      </div>
    );
  }

  // Show user dashboard by default
  return (
    <DashboardPage 
      onStartNewAssessment={(mode = 'new', data = null) => {
        Logger.debug('Starting assessment with mode:', mode, 'and data:', !!data);
        setAssessmentMode(mode);
        setHistoricalData(data);
        setShowAssessment(true);
      }} 
    />
  );
};

export default TryAppPage;
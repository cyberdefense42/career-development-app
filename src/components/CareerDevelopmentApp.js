import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/DemoAuthContext';
import Logger from '../utils/logger';
import { 
  ChevronRight, ChevronLeft, Check, 
  Brain, Target, Sparkles, BarChart3, Heart, Award, 
  Rocket, Home, Lock, CheckCircle2, AlertCircle, Eye
} from 'lucide-react';
import OverviewPage from './steps/OverviewPage';
import EnhancedFiveWhyStep from './steps/EnhancedFiveWhyStep';
import WorkReflectionMatrixStep from './steps/WorkReflectionMatrixStep';
import EnhancedWorkRequirementsStep from './steps/EnhancedWorkRequirementsStep';
import EnhancedValuesStep from './steps/EnhancedValuesStep';
import EnhancedWheelOfLifeStep from './steps/EnhancedWheelOfLifeStep';
import EnhancedStrengthsStep from './steps/EnhancedStrengthsStep';
import DreamJobDiscoveryStep from './steps/DreamJobDiscoveryStep';
import ComprehensiveSummary from './steps/ComprehensiveSummary';

const CareerDevelopmentApp = ({ onBackToDashboard, mode = 'new', historicalData = null }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [formData, setFormData] = useState({
    fiveWhyProblems: [],
    workTasks: [],
    workRequirements: [],
    values: {
      all: [],
      top10: [],
      top5: []
    },
    wheelOfLife: {
      health: 0,
      career: 0,
      relationships: 0,
      personalGrowth: 0,
      finances: 0,
      funRecreation: 0,
      spirituality: 0,
      environment: 0,
      justifications: {}
    },
    strengths: {
      fromWork: [],
      fromTests: [],
      fromFriends: []
    },
    dreamJob: {
      themes: [],
      categories: {},
      vision: {}
    }
  });

  const steps = [
    { 
      id: 0, 
      title: 'Overview', 
      subtitle: 'Your Journey Dashboard',
      icon: Home, 
      component: OverviewPage,
      color: 'from-purple-500 to-pink-500'
    },
    { 
      id: 1, 
      title: '5-Why Analysis', 
      subtitle: 'Uncover Root Causes',
      icon: Brain, 
      component: EnhancedFiveWhyStep,
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 2, 
      title: 'Work Reflection', 
      subtitle: 'Energy & Skills Matrix',
      icon: BarChart3, 
      component: WorkReflectionMatrixStep,
      color: 'from-green-500 to-emerald-500'
    },
    { 
      id: 3, 
      title: 'Work Requirements', 
      subtitle: 'What Matters Most',
      icon: Target, 
      component: EnhancedWorkRequirementsStep,
      color: 'from-orange-500 to-amber-500'
    },
    { 
      id: 4, 
      title: 'Values Mapping', 
      subtitle: 'Core Principles',
      icon: Sparkles, 
      component: EnhancedValuesStep,
      color: 'from-purple-500 to-indigo-500'
    },
    { 
      id: 5, 
      title: 'Wheel of Life', 
      subtitle: 'Life Balance Check',
      icon: Heart, 
      component: EnhancedWheelOfLifeStep,
      color: 'from-red-500 to-pink-500'
    },
    { 
      id: 6, 
      title: 'Your Strengths', 
      subtitle: 'Unique Abilities',
      icon: Award, 
      component: EnhancedStrengthsStep,
      color: 'from-teal-500 to-cyan-500'
    },
    { 
      id: 7, 
      title: 'Dream Job', 
      subtitle: 'Career Vision',
      icon: Rocket, 
      component: DreamJobDiscoveryStep,
      color: 'from-indigo-500 to-purple-500',
      locked: true
    },
    { 
      id: 8, 
      title: 'Summary', 
      subtitle: 'Your Complete Profile',
      icon: CheckCircle2, 
      component: ComprehensiveSummary,
      color: 'from-green-500 to-teal-500'
    }
  ];

  // Check for existing user session
  // User authentication is handled by AuthContext now

  // Load saved progress or historical data
  useEffect(() => {
    if (user) {
      const loadAssessmentData = () => {
        if (mode === 'view' && historicalData) {
          // Load historical assessment data (read-only)
          Logger.debug('Loading historical assessment data');
          const extractedFormData = historicalData.assessmentData?.assessmentData || historicalData.assessmentData || {};
          setFormData(extractedFormData);
          setCompletedSteps(historicalData.assessmentData?.completedSteps || historicalData.completedSteps || []);
          setCurrentStep(0);
        } else {
          // Load from localStorage
          Logger.debug('Loading assessment data from localStorage');
          const savedProgress = localStorage.getItem('userProgress');
          if (savedProgress && mode === 'continue') {
            try {
              const progress = JSON.parse(savedProgress);
              setFormData(progress.formData || {
                fiveWhyProblems: [],
                workTasks: [],
                workRequirements: [],
                values: { all: [], top10: [], top5: [] },
                wheelOfLife: {
                  health: 0, career: 0, relationships: 0, personalGrowth: 0,
                  finances: 0, funRecreation: 0, spirituality: 0, environment: 0
                },
                strengths: { fromWork: [], fromTests: [], fromFriends: [] },
                dreamJob: { themes: [], categories: {}, vision: {} }
              });
              setCurrentStep(progress.currentStep || 0);
              setCompletedSteps(progress.completedSteps || []);
            } catch (error) {
              Logger.error('Error parsing saved progress:', error);
              // Start fresh if saved data is corrupted
              setCurrentStep(0);
              setCompletedSteps([]);
            }
          } else {
            // New assessment - start fresh
            setFormData({
              fiveWhyProblems: [],
              workTasks: [],
              workRequirements: [],
              values: { all: [], top10: [], top5: [] },
              wheelOfLife: {
                health: 0, career: 0, relationships: 0, personalGrowth: 0,
                finances: 0, funRecreation: 0, spirituality: 0, environment: 0
              },
              strengths: { fromWork: [], fromTests: [], fromFriends: [] },
              dreamJob: { themes: [], categories: {}, vision: {} }
            });
            setCurrentStep(0);
            setCompletedSteps([]);
          }
        }
      };

      loadAssessmentData();
    }
  }, [user, mode, historicalData, steps.length]);

  // Authentication is now handled in parent components

  const saveProgress = (newFormData, newStep, newCompletedSteps) => {
    // Only save progress for new/continuing assessments, not historical views
    if (mode !== 'view') {
      const progress = {
        formData: newFormData || formData,
        currentStep: newStep !== undefined ? newStep : currentStep,
        completedSteps: newCompletedSteps || completedSteps,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('userProgress', JSON.stringify(progress));
      Logger.debug('Progress saved to localStorage');
    }
  };

  const updateFormData = (field, value) => {
    const newFormData = {
      ...formData,
      [field]: value
    };
    setFormData(newFormData);
    saveProgress(newFormData);
  };

  const markStepComplete = (stepId) => {
    if (!completedSteps.includes(stepId)) {
      const newCompletedSteps = [...completedSteps, stepId];
      setCompletedSteps(newCompletedSteps);
      saveProgress(formData, currentStep, newCompletedSteps);
      Logger.debug(`Step ${stepId} marked as complete`);
    }
  };

  const handleNext = () => {
    markStepComplete(currentStep);
    if (currentStep < steps.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      saveProgress(formData, newStep);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      saveProgress(formData, newStep);
    }
  };

  const navigateToStep = (stepId) => {
    setCurrentStep(stepId);
    saveProgress(formData, stepId);
  };

  const isStepLocked = (step) => {
    // In historical view mode, no steps are locked (allow full navigation)
    if (mode === 'view') {
      return false;
    }
    
    if (step.locked) {
      // Dream Job is locked until steps 1-6 are complete
      const requiredSteps = [1, 2, 3, 4, 5, 6];
      return !requiredSteps.every(id => completedSteps.includes(id));
    }
    return false;
  };

  const CurrentStepComponent = steps[currentStep].component;

  // User authentication is now handled in TryAppPage, so we can assume user exists

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Modern Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center"
              >
                <Heart className="text-white" size={20} />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Career Assessment</h1>
                <p className="text-sm text-gray-600">Welcome, {user?.displayName || user?.email?.split('@')[0] || 'User'}!</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {onBackToDashboard && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onBackToDashboard}
                  className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Home className="mr-2" size={18} />
                  Dashboard
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        {/* Historical View Indicator */}
        {mode === 'view' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center"
          >
            <Eye className="mr-3 text-amber-600" size={20} />
            <div>
              <p className="font-semibold text-amber-800">Viewing Historical Assessment</p>
              <p className="text-sm text-amber-600">
                Completed on {historicalData?.completedAt ? new Date(historicalData.completedAt.seconds * 1000).toLocaleDateString() : 'Unknown date'}
              </p>
            </div>
          </motion.div>
        )}

        {/* Enhanced Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = completedSteps.includes(step.id);
              const isCurrent = currentStep === step.id;
              const isLocked = isStepLocked(step);
              
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center relative z-10"
                >
                  <motion.button
                    whileHover={!isLocked ? { scale: 1.1 } : {}}
                    whileTap={!isLocked ? { scale: 0.95 } : {}}
                    onClick={() => !isLocked && navigateToStep(step.id)}
                    disabled={isLocked}
                    className={`relative flex items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300 ${
                      isCurrent 
                        ? 'bg-gradient-to-br ' + step.color + ' shadow-lg shadow-indigo-200' 
                        : isCompleted 
                          ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-md' 
                          : isLocked
                            ? 'bg-gray-200 cursor-not-allowed'
                            : 'bg-white border-2 border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    {isLocked ? (
                      <Lock className="text-gray-400" size={24} />
                    ) : isCompleted ? (
                      <Check className="text-white" size={24} />
                    ) : (
                      <Icon className={isCurrent ? 'text-white' : 'text-gray-600'} size={24} />
                    )}
                    {isCurrent && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-2xl bg-white opacity-20"
                      />
                    )}
                  </motion.button>
                  <div className="mt-2 text-center">
                    <p className={`text-xs font-semibold ${isCurrent ? 'text-indigo-600' : 'text-gray-600'}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500 hidden md:block">{step.subtitle}</p>
                  </div>
                </motion.div>
              );
            })}
            {/* Progress Line */}
            <div className="absolute top-8 left-0 right-0 h-1 bg-gray-200" style={{ zIndex: 0 }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((completedSteps.length / (steps.length - 1)) * 100, 100)}%` }}
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
              />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 min-h-[600px]"
          >
            <CurrentStepComponent 
              formData={formData} 
              updateFormData={updateFormData}
              completedSteps={completedSteps}
              navigateToStep={navigateToStep}
              markStepComplete={markStepComplete}
              onComplete={() => markStepComplete(currentStep)}
            />
          </motion.div>
        </AnimatePresence>

        {/* Modern Navigation */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-between mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`flex items-center px-8 py-4 rounded-2xl font-medium transition-all ${
              currentStep === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-indigo-600 border-2 border-indigo-200 hover:bg-indigo-50 shadow-lg'
            }`}
          >
            <ChevronLeft className="mr-2" size={20} />
            Previous
          </motion.button>

          {currentStep === 7 && !completedSteps.includes(7) && (
            <div className="flex items-center space-x-2 text-amber-600">
              <AlertCircle size={20} />
              <span className="text-sm font-medium">Complete all previous sections first</span>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            disabled={currentStep === steps.length - 1 || (currentStep === 7 && isStepLocked(steps[7]))}
            className={`flex items-center px-8 py-4 rounded-2xl font-medium transition-all ${
              currentStep === steps.length - 1 || (currentStep === 7 && isStepLocked(steps[7]))
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
            <ChevronRight className="ml-2" size={20} />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};


export default CareerDevelopmentApp;

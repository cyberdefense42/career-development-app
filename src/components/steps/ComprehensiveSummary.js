import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/DemoAuthContext';
import { Radar } from 'react-chartjs-2';
import Logger from '../../utils/logger';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { 
  CheckCircle2, Download, Printer,
  Brain, Target, Sparkles, Heart, Award, Rocket,
  AlertCircle, ArrowRight, Eye,
  BarChart3
} from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const ComprehensiveSummary = ({ formData, completedSteps, markStepComplete, onComplete }) => {
  const { user, saveAssessment } = useAuth();
  const [expandedSection, setExpandedSection] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [assessmentId, setAssessmentId] = useState(null);

  // Save assessment to database
  const handleSaveAssessment = async () => {
    if (!user) {
      Logger.error('No user found for saving assessment');
      alert('Please make sure you are logged in before saving the assessment.');
      setSaving(false);
      return;
    }

    setSaving(true);
    Logger.debug('Starting assessment save process...');
    Logger.debug('User info:', { email: user.email, displayName: user.displayName, uid: user.uid });
    Logger.debug('Form data preview:', {
      hasValues: !!formData.values,
      hasWorkRequirements: !!formData.workRequirements,
      hasWheelOfLife: !!formData.wheelOfLife,
      completedStepsCount: completedSteps.length
    });

    try {
      // Create comprehensive assessment data
      const assessmentData = {
        // Basic metadata
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        
        // Assessment content
        assessmentData: {
          ...formData,
          completedSteps,
          completionRate: getCompletionRate(),
          
          // Additional computed data
          summary: {
            topValues: formData.values?.top5 || [],
            topStrengths: getAllStrengths().slice(0, 5),
            topRequirements: getTopRequirements().slice(0, 5),
            careerArchetype: formData.dreamJob?.selectedArchetypes?.[0] || null,
            lifeBalanceScore: Math.round((Object.values(formData.wheelOfLife || {}).reduce((a, b) => a + b, 0) / 8) * 10) / 10
          }
        },
        
        // Timestamps
        completedAt: new Date(),
        createdAt: new Date(),
        
        // Version info
        version: '1.0',
        assessmentType: 'comprehensive_career_development'
      };

      Logger.debug('Sending assessment data to database...');
      Logger.debug('Assessment data size:', JSON.stringify(assessmentData).length, 'characters');

      // Add timeout to saveAssessment call
      const savePromise = saveAssessment(assessmentData);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Save operation timed out after 30 seconds')), 30000)
      );

      const id = await Promise.race([savePromise, timeoutPromise]);
      
      Logger.info('Assessment saved successfully with ID:', id);
      setAssessmentId(id);
      setSaved(true);
      
      // Mark step as complete
      if (markStepComplete) {
        markStepComplete(8);
      }
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      Logger.error('Error saving assessment:', error);
      Logger.error('Error details:', error.message, error.stack);
      
      // More specific error messages
      let errorMessage = 'Error saving assessment. ';
      if (error.message.includes('timeout')) {
        errorMessage += 'The save operation timed out. Please check your internet connection and try again.';
      } else if (error.message.includes('permission')) {
        errorMessage += 'Permission denied. Please make sure you are logged in.';
      } else if (error.message.includes('network')) {
        errorMessage += 'Network error. Please check your internet connection.';
      } else {
        errorMessage += 'Please try again. Error: ' + error.message;
      }
      
      alert(errorMessage);
    } finally {
      setSaving(false);
      Logger.debug('Save process completed');
    }
  };

  // Get completion percentage - cap at 100%
  const getCompletionRate = () => {
    const requiredSteps = [1, 2, 3, 4, 5, 6]; // Core assessment steps
    const completed = requiredSteps.filter(step => completedSteps.includes(step)).length;
    const percentage = Math.round((completed / requiredSteps.length) * 100);
    return Math.min(percentage, 100); // Ensure never exceeds 100%
  };

  // Get top 3 problems with solutions
  const getTopProblems = () => {
    return (formData.fiveWhyProblems || [])
      .filter(p => p.problem && p.rootCause)
      .slice(0, 3)
      .map(p => ({
        problem: p.problem,
        rootCause: p.rootCause,
        nextStep: p.nextStep,
        category: p.category
      }));
  };

  // Get work energy balance
  const getEnergyBalance = () => {
    const tasks = formData.workTasks || [];
    const energizing = tasks.filter(t => t.energy > 0).length;
    const draining = tasks.filter(t => t.energy < 0).length;
    const neutral = tasks.filter(t => t.energy === 0).length;
    
    return { energizing, draining, neutral, total: tasks.length };
  };

  // Get top work requirements with match scores
  const getTopRequirements = () => {
    return (formData.workRequirements || [])
      .slice(0, 5)
      .map(req => ({
        name: req.name,
        importance: req.rank || 0,
        currentMatch: req.currentMatch || 0,
        gap: 5 - (req.currentMatch || 0)
      }));
  };

  // Get wheel of life data for radar chart
  const getWheelData = () => {
    const wheel = formData.wheelOfLife || {};
    const categories = ['health', 'career', 'relationships', 'personalGrowth', 'finances', 'funRecreation', 'spirituality', 'environment'];
    const values = categories.map(cat => ((wheel[cat] || 0) + 3) / 6 * 10);
    
    return {
      labels: ['Health', 'Career', 'Relationships', 'Growth', 'Finances', 'Fun', 'Spirituality', 'Environment'],
      datasets: [{
        label: 'Life Balance',
        data: values,
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        pointRadius: 5
      }]
    };
  };

  // Get all unique strengths
  const getAllStrengths = () => {
    const strengths = new Set();
    
    // From work
    formData.strengths?.fromWork?.forEach(ws => {
      ws.strengths.forEach(s => s && strengths.add(s));
    });
    
    // From tests
    formData.strengths?.fromTests?.forEach(s => s && strengths.add(s));
    
    // From friends
    formData.strengths?.fromFriends?.forEach(friend => {
      friend.strengths.forEach(s => s && strengths.add(s));
    });
    
    return Array.from(strengths);
  };

  // Get dream job insights
  const getDreamJobInsights = () => {
    const vision = formData.dreamJob?.vision || {};
    const hasVision = Object.values(vision).some(v => v);
    
    const topCategories = Object.entries(formData.dreamJob?.categories || {})
      .filter(([_, rating]) => rating >= 4)
      .map(([category, rating]) => ({ category, rating }))
      .sort((a, b) => b.rating - a.rating);
    
    return { vision, hasVision, topCategories };
  };

  const sections = [
    { 
      id: 'overview', 
      title: 'Profile Overview', 
      icon: Eye, 
      color: 'indigo',
      completed: true 
    },
    { 
      id: 'problems', 
      title: 'Key Challenges & Solutions', 
      icon: Brain, 
      color: 'blue',
      completed: completedSteps.includes(1) 
    },
    { 
      id: 'work', 
      title: 'Work Energy Analysis', 
      icon: BarChart3, 
      color: 'green',
      completed: completedSteps.includes(2) 
    },
    { 
      id: 'requirements', 
      title: 'Work Requirements Gap', 
      icon: Target, 
      color: 'orange',
      completed: completedSteps.includes(3) 
    },
    { 
      id: 'values', 
      title: 'Core Values', 
      icon: Sparkles, 
      color: 'purple',
      completed: completedSteps.includes(4) 
    },
    { 
      id: 'balance', 
      title: 'Life Balance', 
      icon: Heart, 
      color: 'red',
      completed: completedSteps.includes(5) 
    },
    { 
      id: 'strengths', 
      title: 'Consolidated Strengths', 
      icon: Award, 
      color: 'teal',
      completed: completedSteps.includes(6) 
    },
    { 
      id: 'dreamjob', 
      title: 'Career Vision', 
      icon: Rocket, 
      color: 'indigo',
      completed: completedSteps.includes(7) 
    }
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const summaryData = {
      exportDate: new Date().toISOString(),
      completionRate: getCompletionRate(),
      problems: getTopProblems(),
      energyBalance: getEnergyBalance(),
      requirements: getTopRequirements(),
      values: formData.values?.top5 || [],
      strengths: getAllStrengths(),
      dreamJob: getDreamJobInsights()
    };
    
    const blob = new Blob([JSON.stringify(summaryData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'career-development-summary.json';
    a.click();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl mb-4">
          <CheckCircle2 className="text-white" size={40} />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Your Career Development Summary
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          A comprehensive overview of your self-assessment journey and insights.
        </p>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrint}
          className="flex items-center px-6 py-3 bg-white border-2 border-gray-300 rounded-xl font-medium hover:bg-gray-50"
        >
          <Printer className="mr-2" size={20} />
          Print Summary
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExport}
          className="flex items-center px-6 py-3 bg-indigo-500 text-white rounded-xl font-medium hover:bg-indigo-600"
        >
          <Download className="mr-2" size={20} />
          Export Data
        </motion.button>
      </div>

      {/* Completion Overview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl p-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">Profile Completion</h3>
            <p className="opacity-90">
              You've completed {Math.min(completedSteps.filter(step => [1,2,3,4,5,6,7,8].includes(step)).length, 8)} out of 8 sections
            </p>
          </div>
          <div className="text-5xl font-bold">
            {getCompletionRate()}%
          </div>
        </div>
        <div className="mt-6 bg-white/20 rounded-full h-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${getCompletionRate()}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="bg-white h-full rounded-full"
          />
        </div>
      </motion.div>

      {/* Section Cards */}
      <div className="space-y-4">
        {sections.map((section, index) => {
          const Icon = section.icon;
          const isExpanded = expandedSection === section.id;
          
          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <button
                onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <div className={`w-12 h-12 bg-${section.color}-100 rounded-xl flex items-center justify-center mr-4`}>
                    <Icon className={`text-${section.color}-600`} size={24} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-800">{section.title}</h3>
                    {!section.completed && (
                      <p className="text-sm text-gray-500">Not completed</p>
                    )}
                  </div>
                </div>
                {section.completed && (
                  <CheckCircle2 className="text-green-500" size={24} />
                )}
              </button>

              <AnimatePresence>
                {isExpanded && section.completed && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="px-6 pb-6"
                  >
                    {/* Overview Section */}
                    {section.id === 'overview' && (
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="bg-blue-50 rounded-xl p-4">
                            <p className="text-sm text-blue-600 font-medium">Total Strengths</p>
                            <p className="text-2xl font-bold text-blue-800">{getAllStrengths().length}</p>
                          </div>
                          <div className="bg-purple-50 rounded-xl p-4">
                            <p className="text-sm text-purple-600 font-medium">Core Values</p>
                            <p className="text-2xl font-bold text-purple-800">{formData.values?.top5?.length || 0}</p>
                          </div>
                          <div className="bg-green-50 rounded-xl p-4">
                            <p className="text-sm text-green-600 font-medium">Energy Balance</p>
                            <p className="text-2xl font-bold text-green-800">
                              {getEnergyBalance().energizing}/{getEnergyBalance().total}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Problems Section */}
                    {section.id === 'problems' && (
                      <div className="space-y-4">
                        {getTopProblems().map((problem, idx) => (
                          <div key={idx} className="bg-blue-50 rounded-xl p-4">
                            <h4 className="font-semibold text-blue-900 mb-2">
                              Challenge {idx + 1}: {problem.problem}
                            </h4>
                            <p className="text-blue-700 mb-2">
                              <strong>Root Cause:</strong> {problem.rootCause}
                            </p>
                            {problem.nextStep && (
                              <div className="flex items-center text-blue-600">
                                <ArrowRight size={16} className="mr-2" />
                                <span className="font-medium">Next Step:</span> {problem.nextStep}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Work Energy Section */}
                    {section.id === 'work' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">
                              {getEnergyBalance().energizing}
                            </div>
                            <p className="text-sm text-gray-600">Energizing Tasks</p>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-gray-600">
                              {getEnergyBalance().neutral}
                            </div>
                            <p className="text-sm text-gray-600">Neutral Tasks</p>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-red-600">
                              {getEnergyBalance().draining}
                            </div>
                            <p className="text-sm text-gray-600">Draining Tasks</p>
                          </div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                          <p className="text-green-800">
                            <strong>Recommendation:</strong> Focus on expanding energizing tasks and minimizing draining ones.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Requirements Section */}
                    {section.id === 'requirements' && (
                      <div className="space-y-3">
                        {getTopRequirements().map((req, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                            <div>
                              <span className="font-medium text-gray-800">
                                {idx + 1}. {req.name}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <div className="flex gap-1 mr-4">
                                {[1, 2, 3, 4, 5].map((score) => (
                                  <div
                                    key={score}
                                    className={`w-2 h-6 rounded-full ${
                                      score <= req.currentMatch
                                        ? 'bg-orange-400'
                                        : 'bg-gray-200'
                                    }`}
                                  />
                                ))}
                              </div>
                              {req.gap > 2 && (
                                <AlertCircle className="text-orange-600" size={16} />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Values Section */}
                    {section.id === 'values' && (
                      <div className="flex flex-wrap gap-3">
                        {(formData.values?.top5 || []).map((value, idx) => (
                          <motion.span
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full font-medium text-lg"
                          >
                            {value}
                          </motion.span>
                        ))}
                      </div>
                    )}

                    {/* Life Balance Section */}
                    {section.id === 'balance' && (
                      <div className="h-64">
                        <Radar 
                          data={getWheelData()} 
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                              r: {
                                beginAtZero: true,
                                max: 10,
                                ticks: { stepSize: 2 }
                              }
                            },
                            plugins: {
                              legend: { display: false }
                            }
                          }}
                        />
                      </div>
                    )}

                    {/* Strengths Section */}
                    {section.id === 'strengths' && (
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {getAllStrengths().map((strength, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full font-medium"
                            >
                              {strength}
                            </span>
                          ))}
                        </div>
                        <div className="bg-teal-50 rounded-lg p-4">
                          <p className="text-teal-800">
                            <strong>Total unique strengths identified:</strong> {getAllStrengths().length}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Dream Job Section */}
                    {section.id === 'dreamjob' && getDreamJobInsights().hasVision && (
                      <div className="space-y-4">
                        <div className="bg-indigo-50 rounded-xl p-4">
                          <h4 className="font-semibold text-indigo-800 mb-3">Your Career Vision</h4>
                          <div className="space-y-2 text-indigo-700">
                            {getDreamJobInsights().vision.doing && (
                              <p><strong>What:</strong> {getDreamJobInsights().vision.doing}</p>
                            )}
                            {getDreamJobInsights().vision.withWhom && (
                              <p><strong>With Whom:</strong> {getDreamJobInsights().vision.withWhom}</p>
                            )}
                            {getDreamJobInsights().vision.how && (
                              <p><strong>How:</strong> {getDreamJobInsights().vision.how}</p>
                            )}
                            {getDreamJobInsights().vision.why && (
                              <p><strong>Why:</strong> {getDreamJobInsights().vision.why}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Key Recommendations */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-2xl p-8"
      >
        <h3 className="text-2xl font-bold mb-6">
          🚀 Your Action Plan
        </h3>
        <div className="space-y-4">
          {getTopProblems().length > 0 && (
            <div className="flex items-start">
              <CheckCircle2 className="mr-3 mt-1 flex-shrink-0" size={20} />
              <div>
                <p className="font-semibold">Address Key Challenges</p>
                <p className="text-green-100">
                  Focus on your identified next steps for each root cause
                </p>
              </div>
            </div>
          )}
          
          {getEnergyBalance().draining > getEnergyBalance().energizing && (
            <div className="flex items-start">
              <CheckCircle2 className="mr-3 mt-1 flex-shrink-0" size={20} />
              <div>
                <p className="font-semibold">Rebalance Your Work</p>
                <p className="text-green-100">
                  Reduce time on draining tasks and increase energizing activities
                </p>
              </div>
            </div>
          )}

          {getTopRequirements().some(r => r.gap > 2) && (
            <div className="flex items-start">
              <CheckCircle2 className="mr-3 mt-1 flex-shrink-0" size={20} />
              <div>
                <p className="font-semibold">Close Requirement Gaps</p>
                <p className="text-green-100">
                  Discuss unmet needs with your manager or explore new opportunities
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start">
            <CheckCircle2 className="mr-3 mt-1 flex-shrink-0" size={20} />
            <div>
              <p className="font-semibold">Leverage Your Strengths</p>
              <p className="text-green-100">
                Seek roles and projects that utilize your {getAllStrengths().length} identified strengths
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <CheckCircle2 className="mr-3 mt-1 flex-shrink-0" size={20} />
            <div>
              <p className="font-semibold">Align with Your Values</p>
              <p className="text-green-100">
                Ensure your work environment supports your core values
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Complete Assessment Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-8 text-center"
      >
        {!saved ? (
          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveAssessment}
              disabled={saving}
              className={`px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-2xl hover:shadow-xl transition-all duration-300 text-lg ${
                saving ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
            {saving ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full inline-block mr-3"
                />
                Saving Assessment...
              </>
            ) : (
              <>
                Complete & Save Assessment
                <ArrowRight className="ml-2 inline" size={20} />
              </>
            )}
          </motion.button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-2xl mb-4">
              <CheckCircle2 className="mr-3" size={24} />
              Assessment Saved Successfully!
            </div>
            <p className="text-gray-600 text-sm">
              Assessment ID: <span className="font-mono text-gray-800">{assessmentId}</span>
            </p>
          </motion.div>
        )}
        
        <p className="mt-4 text-gray-600 text-sm">
          Congratulations! You've completed your comprehensive career development assessment.
        </p>
      </motion.div>

      {/* Assessment Overview - Show when saved */}
      {saved && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Assessment Overview</h2>
            <p className="text-gray-600">Here's a comprehensive summary of your career development assessment</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Completion Rate */}
            <div className="bg-white rounded-2xl p-6 text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">{getCompletionRate()}%</div>
              <div className="text-gray-600">Completion Rate</div>
            </div>

            {/* Top Values */}
            <div className="bg-white rounded-2xl p-6">
              <h4 className="font-bold text-gray-800 mb-3">Top Values</h4>
              <div className="space-y-2">
                {(formData.values?.top5 || []).slice(0, 3).map((value, idx) => (
                  <div key={idx} className="text-sm text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                    {value}
                  </div>
                ))}
              </div>
            </div>

            {/* Key Strengths */}
            <div className="bg-white rounded-2xl p-6">
              <h4 className="font-bold text-gray-800 mb-3">Key Strengths</h4>
              <div className="space-y-2">
                {getAllStrengths().slice(0, 3).map((strength, idx) => (
                  <div key={idx} className="text-sm text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                    {strength}
                  </div>
                ))}
              </div>
            </div>

            {/* Work Requirements */}
            <div className="bg-white rounded-2xl p-6">
              <h4 className="font-bold text-gray-800 mb-3">Top Work Requirements</h4>
              <div className="space-y-2">
                {getTopRequirements().slice(0, 3).map((req, idx) => (
                  <div key={idx} className="text-sm text-orange-700 bg-orange-100 px-3 py-1 rounded-full">
                    {req.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Career Archetype */}
            <div className="bg-white rounded-2xl p-6">
              <h4 className="font-bold text-gray-800 mb-3">Career Archetype</h4>
              <div className="text-2xl font-bold text-indigo-600">
                {formData.dreamJob?.selectedArchetypes?.[0] || 'To be determined'}
              </div>
            </div>

            {/* Life Balance Score */}
            <div className="bg-white rounded-2xl p-6 text-center">
              <div className="text-4xl font-bold text-teal-600 mb-2">
                {Math.round((Object.values(formData.wheelOfLife || {}).reduce((a, b) => a + b, 0) / 8) * 10) / 10 || 'N/A'}
              </div>
              <div className="text-gray-600">Life Balance Score</div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-2xl p-6">
            <h4 className="font-bold text-gray-800 mb-4 flex items-center">
              <Target className="mr-2 text-blue-500" size={20} />
              Recommended Next Steps
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <CheckCircle2 className="mr-3 mt-1 text-green-500 flex-shrink-0" size={18} />
                <div>
                  <p className="font-medium text-gray-800">Review Your Results</p>
                  <p className="text-sm text-gray-600">Take time to reflect on your assessment insights</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="mr-3 mt-1 text-green-500 flex-shrink-0" size={18} />
                <div>
                  <p className="font-medium text-gray-800">Set Career Goals</p>
                  <p className="text-sm text-gray-600">Use your values and strengths to plan your next moves</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="mr-3 mt-1 text-green-500 flex-shrink-0" size={18} />
                <div>
                  <p className="font-medium text-gray-800">Network Strategically</p>
                  <p className="text-sm text-gray-600">Connect with professionals in your target career archetype</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="mr-3 mt-1 text-green-500 flex-shrink-0" size={18} />
                <div>
                  <p className="font-medium text-gray-800">Track Your Progress</p>
                  <p className="text-sm text-gray-600">Revisit this assessment periodically to measure growth</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.print()}
              className="px-6 py-3 bg-white border-2 border-blue-500 text-blue-500 rounded-xl font-semibold hover:bg-blue-50 transition-all"
            >
              <Printer className="mr-2 inline" size={18} />
              Print Results
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                // Navigate back to dashboard
                if (onComplete) {
                  onComplete();
                }
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              <Eye className="mr-2 inline" size={18} />
              View Dashboard
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ComprehensiveSummary;
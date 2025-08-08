import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ReactPlayer from 'react-player';
import { 
  Play, Brain, BarChart3, Target, Sparkles, 
  Heart, Award, Rocket, CheckCircle, Circle,
  TrendingUp, Users, Zap, X
} from 'lucide-react';

const OverviewPage = ({ formData, completedSteps, navigateToStep }) => {
  const [playingVideo, setPlayingVideo] = useState(null);
  const [playerReady, setPlayerReady] = useState({});

  const sections = [
    {
      id: 1,
      title: '5-Why Analysis',
      icon: Brain,
      color: 'from-blue-500 to-cyan-500',
      description: 'Uncover the root causes of your challenges',
      videoUrl: 'https://youtu.be/-_nN_YTDsuk',
      stats: {
        problems: formData.fiveWhyProblems?.length || 0,
        completed: completedSteps.includes(1)
      }
    },
    {
      id: 2,
      title: 'Work Reflection',
      icon: BarChart3,
      color: 'from-green-500 to-emerald-500',
      description: 'Analyze your energy and skills matrix',
      videoUrl: 'https://youtu.be/-_nN_YTDsuk',
      stats: {
        tasks: formData.workTasks?.length || 0,
        completed: completedSteps.includes(2)
      }
    },
    {
      id: 3,
      title: 'Work Requirements',
      icon: Target,
      color: 'from-orange-500 to-amber-500',
      description: 'Define what matters most in your career',
      videoUrl: 'https://youtu.be/-_nN_YTDsuk',
      stats: {
        requirements: formData.workRequirements?.length || 0,
        completed: completedSteps.includes(3)
      }
    },
    {
      id: 4,
      title: 'Values Mapping',
      icon: Sparkles,
      color: 'from-purple-500 to-indigo-500',
      description: 'Discover your core values',
      videoUrl: 'https://youtu.be/-_nN_YTDsuk',
      stats: {
        values: formData.values?.top5?.length || 0,
        completed: completedSteps.includes(4)
      }
    },
    {
      id: 5,
      title: 'Wheel of Life',
      icon: Heart,
      color: 'from-red-500 to-pink-500',
      description: 'Assess your life balance',
      videoUrl: 'https://youtu.be/-_nN_YTDsuk',
      stats: {
        avgScore: calculateWheelAverage(formData.wheelOfLife),
        completed: completedSteps.includes(5)
      }
    },
    {
      id: 6,
      title: 'Your Strengths',
      icon: Award,
      color: 'from-teal-500 to-cyan-500',
      description: 'Identify your unique abilities',
      videoUrl: 'https://youtu.be/-_nN_YTDsuk',
      stats: {
        strengths: countAllStrengths(formData.strengths),
        completed: completedSteps.includes(6)
      }
    }
  ];

  function calculateWheelAverage(wheel) {
    if (!wheel) return 0;
    const values = Object.values(wheel).filter(v => typeof v === 'number');
    if (values.length === 0) return 0;
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    return ((avg + 3) / 6 * 10).toFixed(1); // Convert -3 to 3 scale to 0-10
  }

  function countAllStrengths(strengths) {
    if (!strengths) return 0;
    return (strengths.fromWork?.length || 0) + 
           (strengths.fromTests?.length || 0) + 
           (strengths.fromFriends?.length || 0);
  }

  const handleVideoClick = (sectionId) => {
    setPlayingVideo(sectionId);
    setPlayerReady(prev => ({ ...prev, [sectionId]: false }));
  };

  const handleStopVideo = () => {
    setPlayingVideo(null);
    setPlayerReady({});
  };

  const getTopProblems = () => {
    return formData.fiveWhyProblems?.slice(0, 3) || [];
  };

  const getTopValues = () => {
    return formData.values?.top5 || [];
  };

  const getTopRequirements = () => {
    return formData.workRequirements?.slice(0, 5) || [];
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Your Career Development Journey
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Track your progress, review insights, and watch helpful videos for each section.
        </p>
      </motion.div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Overall Progress</h2>
            <p className="opacity-90">You've completed {Math.min(completedSteps.filter(step => [1,2,3,4,5,6,7,8].includes(step)).length, 8)} out of 8 sections</p>
          </div>
          <div className="relative w-32 h-32">
            <svg className="transform -rotate-90 w-32 h-32">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="white"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - completedSteps.length / 8)}`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold">
                {Math.min(Math.round((completedSteps.filter(step => [1,2,3,4,5,6,7,8].includes(step)).length / 8) * 100), 100)}%
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Section Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section, index) => {
          const Icon = section.icon;
          const isCompleted = section.stats.completed;
          
          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
            >
              {/* Video Section */}
              <div className="relative h-48 bg-gray-100">
                {playingVideo === section.id ? (
                  <div className="relative w-full h-full">
                    <iframe
                      width="100%"
                      height="100%"
                      src="https://www.youtube.com/embed/-_nN_YTDsuk?si=8Wtqq0PnlsEah-XI"
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      className="rounded-t-2xl"
                    />
                    <button
                      onClick={handleStopVideo}
                      className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-all z-10"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div 
                    className={`h-full bg-gradient-to-br ${section.color} flex items-center justify-center cursor-pointer group`}
                    onClick={() => handleVideoClick(section.id)}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all"
                    >
                      <Play className="text-white ml-1" size={32} />
                    </motion.div>
                  </div>
                )}
                {isCompleted && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                    <CheckCircle size={16} className="mr-1" />
                    Completed
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-800">{section.title}</h3>
                  <Icon className="text-gray-400" size={24} />
                </div>
                <p className="text-gray-600 mb-4">{section.description}</p>
                
                {/* Stats */}
                <div className="mb-4">
                  {section.id === 1 && (
                    <p className="text-sm text-gray-500">
                      {section.stats.problems} problem{section.stats.problems !== 1 ? 's' : ''} analyzed
                    </p>
                  )}
                  {section.id === 2 && (
                    <p className="text-sm text-gray-500">
                      {section.stats.tasks} task{section.stats.tasks !== 1 ? 's' : ''} evaluated
                    </p>
                  )}
                  {section.id === 3 && (
                    <p className="text-sm text-gray-500">
                      {section.stats.requirements} requirement{section.stats.requirements !== 1 ? 's' : ''} defined
                    </p>
                  )}
                  {section.id === 4 && (
                    <p className="text-sm text-gray-500">
                      {section.stats.values} core value{section.stats.values !== 1 ? 's' : ''} identified
                    </p>
                  )}
                  {section.id === 5 && (
                    <p className="text-sm text-gray-500">
                      Average score: {section.stats.avgScore}/10
                    </p>
                  )}
                  {section.id === 6 && (
                    <p className="text-sm text-gray-500">
                      {section.stats.strengths} strength{section.stats.strengths !== 1 ? 's' : ''} discovered
                    </p>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigateToStep(section.id)}
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    isCompleted
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : `bg-gradient-to-r ${section.color} text-white hover:shadow-lg`
                  }`}
                >
                  {isCompleted ? 'Review' : 'Start'} Section
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Key Insights Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-800">Key Insights</h2>
        
        {/* Top Problems */}
        {getTopProblems().length > 0 && (
          <div className="bg-blue-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
              <Brain className="mr-2" size={20} />
              Top Challenges
            </h3>
            <div className="space-y-3">
              {getTopProblems().map((problem, index) => (
                <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="font-medium text-gray-800 mb-1">{problem.problem}</p>
                  <p className="text-sm text-gray-600">Root cause: {problem.rootCause}</p>
                  {problem.nextStep && (
                    <p className="text-sm text-blue-600 mt-2">Next: {problem.nextStep}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Values */}
        {getTopValues().length > 0 && (
          <div className="bg-purple-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
              <Sparkles className="mr-2" size={20} />
              Core Values
            </h3>
            <div className="flex flex-wrap gap-2">
              {getTopValues().map((value, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-purple-200 text-purple-800 rounded-full font-medium"
                >
                  {value}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Top Requirements */}
        {getTopRequirements().length > 0 && (
          <div className="bg-orange-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-orange-900 mb-4 flex items-center">
              <Target className="mr-2" size={20} />
              Top Work Requirements
            </h3>
            <div className="space-y-2">
              {getTopRequirements().map((req, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-700">{index + 1}. {req.name}</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((score) => (
                      <div
                        key={score}
                        className={`w-2 h-8 rounded-full ${
                          score <= (req.currentMatch || 0)
                            ? 'bg-orange-400'
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default OverviewPage;
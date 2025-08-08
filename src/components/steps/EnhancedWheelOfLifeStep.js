import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { 
  Heart, Briefcase, Users, TrendingUp, DollarSign, 
  Smile, Star, Home, AlertCircle, Brain, Plus
} from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const EnhancedWheelOfLifeStep = ({ formData, updateFormData }) => {
  const [wheelData, setWheelData] = useState(formData.wheelOfLife || {
    health: 0,
    career: 0,
    relationships: 0,
    personalGrowth: 0,
    finances: 0,
    funRecreation: 0,
    spirituality: 0,
    environment: 0,
    justifications: {}
  });

  const [expandedCategory, setExpandedCategory] = useState(null);
  const [showDeepDive, setShowDeepDive] = useState(false);

  const categories = [
    { 
      id: 'health', 
      label: 'Health', 
      icon: Heart, 
      color: 'red',
      prompt: 'How satisfied are you with your physical and mental wellbeing?',
      examples: 'fitness, nutrition, sleep quality, stress levels'
    },
    { 
      id: 'career', 
      label: 'Career / Work', 
      icon: Briefcase, 
      color: 'blue',
      prompt: 'How satisfied are you with your job and professional growth?',
      examples: 'job satisfaction, growth opportunities, work environment'
    },
    { 
      id: 'relationships', 
      label: 'Relationships', 
      icon: Users, 
      color: 'purple',
      prompt: 'How satisfied are you with your connections to others?',
      examples: 'family, partner, friendships, social network'
    },
    { 
      id: 'personalGrowth', 
      label: 'Personal Growth', 
      icon: TrendingUp, 
      color: 'green',
      prompt: 'How satisfied are you with your learning and development?',
      examples: 'skills, knowledge, self-improvement, hobbies'
    },
    { 
      id: 'finances', 
      label: 'Finances', 
      icon: DollarSign, 
      color: 'emerald',
      prompt: 'How satisfied are you with your financial situation?',
      examples: 'income, savings, investments, financial security'
    },
    { 
      id: 'funRecreation', 
      label: 'Fun & Recreation', 
      icon: Smile, 
      color: 'orange',
      prompt: 'How satisfied are you with your leisure and enjoyment?',
      examples: 'hobbies, travel, entertainment, relaxation'
    },
    { 
      id: 'spirituality', 
      label: 'Spirituality', 
      icon: Star, 
      color: 'indigo',
      prompt: 'How satisfied are you with your sense of purpose and meaning?',
      examples: 'values, beliefs, meditation, inner peace'
    },
    { 
      id: 'environment', 
      label: 'Environment', 
      icon: Home, 
      color: 'teal',
      prompt: 'How satisfied are you with your physical surroundings?',
      examples: 'living space, workspace, community, nature access'
    }
  ];

  const satisfactionLevels = [
    { value: -3, label: 'Very Dissatisfied', emoji: '😞' },
    { value: -2, label: 'Dissatisfied', emoji: '😔' },
    { value: -1, label: 'Somewhat Dissatisfied', emoji: '😕' },
    { value: 0, label: 'Neutral', emoji: '😐' },
    { value: 1, label: 'Somewhat Satisfied', emoji: '🙂' },
    { value: 2, label: 'Satisfied', emoji: '😊' },
    { value: 3, label: 'Very Satisfied', emoji: '😄' }
  ];

  const updateCategory = (categoryId, value) => {
    const newData = {
      ...wheelData,
      [categoryId]: value
    };
    setWheelData(newData);
    updateFormData('wheelOfLife', newData);
  };

  const updateJustification = (categoryId, text) => {
    const newData = {
      ...wheelData,
      justifications: {
        ...wheelData.justifications,
        [categoryId]: text
      }
    };
    setWheelData(newData);
    updateFormData('wheelOfLife', newData);
  };

  // Convert -3 to 3 scale to 0-10 for radar chart
  const getChartData = () => {
    const values = categories.map(cat => ((wheelData[cat.id] + 3) / 6) * 10);
    
    return {
      labels: categories.map(cat => cat.label),
      datasets: [
        {
          label: 'Current Satisfaction',
          data: values,
          backgroundColor: 'rgba(99, 102, 241, 0.2)',
          borderColor: 'rgba(99, 102, 241, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(99, 102, 241, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(99, 102, 241, 1)',
          pointRadius: 5,
          pointHoverRadius: 7
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        max: 10,
        ticks: {
          stepSize: 2
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const originalValue = Math.round((value / 10) * 6 - 3);
            return `${context.label}: ${value.toFixed(1)}/10 (${originalValue > 0 ? '+' : ''}${originalValue})`;
          }
        }
      }
    }
  };

  const getCriticalCategories = () => {
    return categories.filter(cat => wheelData[cat.id] <= -1);
  };

  const getAverageScore = () => {
    const scores = categories.map(cat => wheelData[cat.id]);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    return ((avg + 3) / 6 * 10).toFixed(1);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl mb-4">
          <Heart className="text-white" size={40} />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Wheel of Life Assessment
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Evaluate your satisfaction across key life areas to identify where you thrive and where you need attention.
        </p>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Category Ratings */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold mb-4">Rate Each Life Area</h3>
          
          {categories.map((category, index) => {
            const Icon = category.icon;
            const value = wheelData[category.id];
            const currentLevel = satisfactionLevels.find(l => l.value === value);
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-xl shadow-md p-4 border-2 transition-all ${
                  expandedCategory === category.id ? `border-${category.color}-300` : 'border-transparent'
                }`}
              >
                <div
                  className="cursor-pointer"
                  onClick={() => setExpandedCategory(
                    expandedCategory === category.id ? null : category.id
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 bg-${category.color}-100 rounded-lg flex items-center justify-center mr-3`}>
                        <Icon className={`text-${category.color}-600`} size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{category.label}</h4>
                        <p className="text-xs text-gray-500">{category.examples}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl">{currentLevel?.emoji}</span>
                      <p className="text-sm font-medium text-gray-600">
                        {value > 0 && '+'}{value}
                      </p>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedCategory === category.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 border-t">
                        <p className="text-sm text-gray-600 mb-3">{category.prompt}</p>
                        
                        {/* Rating Buttons */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {satisfactionLevels.map((level) => (
                            <motion.button
                              key={level.value}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => updateCategory(category.id, level.value)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                value === level.value
                                  ? 'bg-indigo-500 text-white'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {level.emoji} {level.value > 0 && '+'}{level.value}
                            </motion.button>
                          ))}
                        </div>

                        {/* Justification */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Why do you feel this way?
                          </label>
                          <textarea
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                            rows="2"
                            placeholder="Explain your rating..."
                            value={wheelData.justifications?.[category.id] || ''}
                            onChange={(e) => updateJustification(category.id, e.target.value)}
                          />
                        </div>

                        {/* 5-Why Prompt for Low Scores */}
                        {value <= -1 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-3 p-3 bg-red-50 rounded-lg flex items-center justify-between"
                          >
                            <div className="flex items-center text-red-700">
                              <AlertCircle size={16} className="mr-2" />
                              <span className="text-sm">Consider analyzing this with 5-Why</span>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded-md font-medium"
                            >
                              <Brain size={14} className="inline mr-1" />
                              Analyze
                            </motion.button>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Right: Radar Chart */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Your Life Balance</h3>
            <div className="h-96">
              <Radar data={getChartData()} options={chartOptions} />
            </div>
            <div className="mt-4 text-center">
              <p className="text-lg font-semibold text-gray-800">
                Average Score: {getAverageScore()}/10
              </p>
              <p className="text-sm text-gray-600">
                {getAverageScore() >= 7 ? 'Great balance!' :
                 getAverageScore() >= 5 ? 'Room for improvement' :
                 'Several areas need attention'}
              </p>
            </div>
          </div>

          {/* Critical Areas */}
          {getCriticalCategories().length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 rounded-xl p-6"
            >
              <h4 className="font-semibold text-red-800 mb-3 flex items-center">
                <AlertCircle className="mr-2" size={20} />
                Areas Needing Attention
              </h4>
              <div className="space-y-2">
                {getCriticalCategories().map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <div key={cat.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex items-center">
                        <Icon className="text-red-600 mr-2" size={18} />
                        <span className="font-medium text-gray-800">{cat.label}</span>
                      </div>
                      <span className="text-red-600 font-semibold">
                        {wheelData[cat.id]}
                      </span>
                    </div>
                  );
                })}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowDeepDive(true)}
                className="w-full mt-4 py-3 bg-red-100 text-red-700 rounded-lg font-medium flex items-center justify-center"
              >
                <Brain className="mr-2" size={18} />
                Analyze with 5-Why Method
              </motion.button>
            </motion.div>
          )}

          {/* Insights */}
          <div className="bg-indigo-50 rounded-xl p-6">
            <h4 className="font-semibold text-indigo-800 mb-3">Quick Insights</h4>
            <ul className="space-y-2 text-sm text-indigo-700">
              <li>• Your strongest area: {
                categories.reduce((max, cat) => 
                  wheelData[cat.id] > wheelData[max.id] ? cat : max
                ).label
              }</li>
              <li>• Areas above average: {
                categories.filter(cat => wheelData[cat.id] > 0).length
              }/8</li>
              <li>• Consider focusing on 1-2 low-scoring areas at a time</li>
              <li>• Small improvements in multiple areas can boost overall satisfaction</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedWheelOfLifeStep;
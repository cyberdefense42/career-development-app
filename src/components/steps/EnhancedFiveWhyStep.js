import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, ChevronDown, ChevronUp, Brain, 
  Briefcase, Heart, Users, DollarSign, Home, 
  AlertCircle, Target, Lightbulb
} from 'lucide-react';

const EnhancedFiveWhyStep = ({ formData, updateFormData }) => {
  const [problems, setProblems] = useState(formData.fiveWhyProblems || []);
  const [expandedProblem, setExpandedProblem] = useState(null);
  const [isAddingProblem, setIsAddingProblem] = useState(false);

  const categories = [
    { id: 'work', label: 'Work', icon: Briefcase, color: 'blue' },
    { id: 'health', label: 'Health', icon: Heart, color: 'red' },
    { id: 'relationships', label: 'Relationships', icon: Users, color: 'purple' },
    { id: 'finances', label: 'Finances', icon: DollarSign, color: 'green' },
    { id: 'personal', label: 'Personal', icon: Home, color: 'orange' }
  ];

  const createNewProblem = () => ({
    id: Date.now(),
    problem: '',
    category: 'work',
    whys: ['', '', '', '', ''],
    rootCause: '',
    nextStep: '',
    createdAt: new Date().toISOString()
  });

  const addProblem = () => {
    const newProblem = createNewProblem();
    setProblems([...problems, newProblem]);
    setExpandedProblem(newProblem.id);
    setIsAddingProblem(true);
  };

  const updateProblem = (problemId, field, value) => {
    const updatedProblems = problems.map(p => 
      p.id === problemId ? { ...p, [field]: value } : p
    );
    setProblems(updatedProblems);
    updateFormData('fiveWhyProblems', updatedProblems);
  };

  const updateWhy = (problemId, whyIndex, value) => {
    const updatedProblems = problems.map(p => {
      if (p.id === problemId) {
        const newWhys = [...p.whys];
        newWhys[whyIndex] = value;
        return { ...p, whys: newWhys };
      }
      return p;
    });
    setProblems(updatedProblems);
    updateFormData('fiveWhyProblems', updatedProblems);
  };

  const deleteProblem = (problemId) => {
    const updatedProblems = problems.filter(p => p.id !== problemId);
    setProblems(updatedProblems);
    updateFormData('fiveWhyProblems', updatedProblems);
  };

  const getCategoryIcon = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.icon : Brain;
  };

  const getCategoryColor = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.color : 'gray';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-4">
          <Brain className="text-white" size={40} />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          5-Why Root Cause Analysis
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Dig deep into your challenges to uncover the real issues. Add multiple problems and analyze each one thoroughly.
        </p>
      </motion.div>

      {/* Add Problem Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addProblem}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="mr-2" size={20} />
          Add New Problem
        </motion.button>
      </motion.div>

      {/* Problems List */}
      <AnimatePresence>
        {problems.length === 0 && !isAddingProblem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <AlertCircle className="mx-auto text-gray-300 mb-4" size={64} />
            <p className="text-gray-500 text-lg">No problems added yet.</p>
            <p className="text-gray-400">Click "Add New Problem" to start your analysis.</p>
          </motion.div>
        )}

        <div className="space-y-6">
          {problems.map((problem, index) => {
            const Icon = getCategoryIcon(problem.category);
            const color = getCategoryColor(problem.category);
            const isExpanded = expandedProblem === problem.id;
            
            return (
              <motion.div
                key={problem.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                {/* Problem Header */}
                <div 
                  className={`p-6 cursor-pointer transition-all ${
                    isExpanded ? `bg-${color}-50` : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setExpandedProblem(isExpanded ? null : problem.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 bg-${color}-100 rounded-xl flex items-center justify-center`}>
                        <Icon className={`text-${color}-600`} size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {problem.problem || 'New Problem'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Category: {categories.find(c => c.id === problem.category)?.label}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteProblem(problem.id);
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </motion.button>
                      {isExpanded ? <ChevronUp /> : <ChevronDown />}
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6"
                    >
                      {/* Problem Statement */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Problem Statement
                        </label>
                        <textarea
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          rows="2"
                          placeholder="Describe your challenge..."
                          value={problem.problem}
                          onChange={(e) => updateProblem(problem.id, 'problem', e.target.value)}
                        />
                      </div>

                      {/* Category Selection */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category
                        </label>
                        <div className="flex gap-2">
                          {categories.map((cat) => {
                            const CatIcon = cat.icon;
                            return (
                              <motion.button
                                key={cat.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => updateProblem(problem.id, 'category', cat.id)}
                                className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                                  problem.category === cat.id
                                    ? `bg-${cat.color}-100 text-${cat.color}-700 border-2 border-${cat.color}-300`
                                    : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                                }`}
                              >
                                <CatIcon size={16} className="mr-2" />
                                {cat.label}
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 5 Whys */}
                      <div className="space-y-4 mb-6">
                        <h4 className="font-medium text-gray-700">Ask "Why?" 5 Times</h4>
                        {problem.whys.map((why, whyIndex) => (
                          <motion.div
                            key={whyIndex}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: whyIndex * 0.1 }}
                            className="relative"
                          >
                            <div className="absolute left-0 top-3 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                              {whyIndex + 1}
                            </div>
                            <input
                              type="text"
                              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              placeholder={whyIndex === 0 ? "Why is this a problem?" : "Why is that?"}
                              value={why}
                              onChange={(e) => updateWhy(problem.id, whyIndex, e.target.value)}
                            />
                            {whyIndex < problem.whys.length - 1 && (
                              <div className="absolute left-4 top-11 w-0.5 h-8 bg-blue-200" />
                            )}
                          </motion.div>
                        ))}
                      </div>

                      {/* Root Cause */}
                      <div className="mb-6 p-4 bg-red-50 rounded-xl">
                        <label className="flex items-center text-sm font-medium text-red-700 mb-2">
                          <AlertCircle size={16} className="mr-2" />
                          Root Cause
                        </label>
                        <textarea
                          className="w-full p-3 bg-white border-2 border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                          rows="2"
                          placeholder="What's the core issue?"
                          value={problem.rootCause}
                          onChange={(e) => updateProblem(problem.id, 'rootCause', e.target.value)}
                        />
                      </div>

                      {/* Next Step */}
                      <div className="p-4 bg-green-50 rounded-xl">
                        <label className="flex items-center text-sm font-medium text-green-700 mb-2">
                          <Target size={16} className="mr-2" />
                          Next Step
                        </label>
                        <input
                          type="text"
                          className="w-full p-3 bg-white border-2 border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                          placeholder="What action will you take?"
                          value={problem.nextStep}
                          onChange={(e) => updateProblem(problem.id, 'nextStep', e.target.value)}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </AnimatePresence>

      {/* Tips Section */}
      {problems.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6"
        >
          <h3 className="flex items-center font-semibold text-blue-800 mb-3">
            <Lightbulb className="mr-2" size={20} />
            Tips for Effective 5-Why Analysis
          </h3>
          <ul className="space-y-2 text-blue-700">
            <li className="flex items-start">
              <span className="mr-2">"</span>
              Be honest and specific with each "why" - avoid vague answers
            </li>
            <li className="flex items-start">
              <span className="mr-2">"</span>
              Focus on process and systems, not people or blame
            </li>
            <li className="flex items-start">
              <span className="mr-2">"</span>
              The root cause should be something you can take action on
            </li>
            <li className="flex items-start">
              <span className="mr-2">"</span>
              Your next step should be small, concrete, and achievable
            </li>
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default EnhancedFiveWhyStep;
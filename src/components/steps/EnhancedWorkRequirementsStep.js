import React, { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { 
  Target, GripVertical, Check, X, AlertCircle,
  Briefcase, Users, Clock, Home, Heart, TrendingUp,
  Award, Shield, Sparkles, DollarSign
} from 'lucide-react';
import Logger from '../../utils/logger';

const EnhancedWorkRequirementsStep = ({ formData, updateFormData, onComplete, markStepComplete }) => {
  const [phase, setPhase] = useState('selection'); // selection, ranking, details
  const [selectedRequirements, setSelectedRequirements] = useState(() => {
    // Initialize from saved data or empty array
    if (formData.workRequirements?.length > 0) {
      return formData.workRequirements.map(r => r.id || r.name);
    }
    return [];
  });
  const [rankedRequirements, setRankedRequirements] = useState(
    formData.workRequirements || []
  );


  const allRequirements = [
    { id: 'balance', name: 'Work-life balance', icon: Heart, category: 'lifestyle' },
    { id: 'development', name: 'Professional development', icon: TrendingUp, category: 'growth' },
    { id: 'flexibility', name: 'Flexible working hours', icon: Clock, category: 'lifestyle' },
    { id: 'remote', name: 'Remote work options', icon: Home, category: 'lifestyle' },
    { id: 'salary', name: 'Competitive salary', icon: DollarSign, category: 'compensation' },
    { id: 'benefits', name: 'Health & wellness benefits', icon: Shield, category: 'compensation' },
    { id: 'team', name: 'Team collaboration', icon: Users, category: 'culture' },
    { id: 'recognition', name: 'Recognition & appreciation', icon: Award, category: 'culture' },
    { id: 'security', name: 'Job security', icon: Shield, category: 'stability' },
    { id: 'creativity', name: 'Creative freedom', icon: Sparkles, category: 'growth' },
    { id: 'progression', name: 'Clear career progression', icon: TrendingUp, category: 'growth' },
    { id: 'mentorship', name: 'Mentorship programs', icon: Users, category: 'growth' },
    { id: 'culture', name: 'Company culture fit', icon: Heart, category: 'culture' },
    { id: 'meaningful', name: 'Meaningful work', icon: Target, category: 'purpose' },
    { id: 'autonomy', name: 'Autonomy & independence', icon: Briefcase, category: 'lifestyle' },
    { id: 'innovation', name: 'Innovation opportunities', icon: Sparkles, category: 'growth' },
    { id: 'transparency', name: 'Transparent communication', icon: Users, category: 'culture' },
    { id: 'diversity', name: 'Diversity & inclusion', icon: Users, category: 'culture' },
    { id: 'impact', name: 'Social/environmental impact', icon: Heart, category: 'purpose' },
    { id: 'learning', name: 'Continuous learning', icon: TrendingUp, category: 'growth' }
  ];

  const categories = [
    { id: 'lifestyle', label: 'Lifestyle', color: 'blue' },
    { id: 'growth', label: 'Growth', color: 'green' },
    { id: 'compensation', label: 'Compensation', color: 'purple' },
    { id: 'culture', label: 'Culture', color: 'orange' },
    { id: 'stability', label: 'Stability', color: 'gray' },
    { id: 'purpose', label: 'Purpose', color: 'pink' }
  ];

  const toggleRequirement = (reqId) => {
    if (selectedRequirements.includes(reqId)) {
      setSelectedRequirements(selectedRequirements.filter(id => id !== reqId));
    } else if (selectedRequirements.length < 10) {
      setSelectedRequirements([...selectedRequirements, reqId]);
    }
  };

  const proceedToRanking = () => {
    const ranked = selectedRequirements.map((reqId, index) => {
      const req = allRequirements.find(r => r.id === reqId);
      const existing = formData.workRequirements?.find(wr => wr.id === reqId);
      return {
        id: reqId,
        name: req.name,
        icon: req.icon,
        category: req.category,
        rank: existing?.rank || index + 1,
        importance: existing?.importance || '',
        currentMatch: existing?.currentMatch || 3
      };
    });
    setRankedRequirements(ranked.sort((a, b) => a.rank - b.rank));
    setPhase('ranking');
  };

  const updateRankOrder = (newOrder) => {
    const reranked = newOrder.map((req, index) => ({
      ...req,
      rank: index + 1
    }));
    setRankedRequirements(reranked);
  };

  const updateRequirementDetails = (reqId, field, value) => {
    const updated = rankedRequirements.map(req =>
      req.id === reqId ? { ...req, [field]: value } : req
    );
    setRankedRequirements(updated);
    updateFormData('workRequirements', updated);
  };

  const handleComplete = () => {
    Logger.info('WorkRequirements: Step completed successfully');
    
    // Save the final data
    updateFormData('workRequirements', rankedRequirements);
    
    // Mark step as complete if function is available
    if (markStepComplete) {
      markStepComplete(3);
    }
    
    // Call onComplete if available
    if (onComplete) {
      onComplete();
    }
  };

  const saveAndProceed = () => {
    updateFormData('workRequirements', rankedRequirements);
    setPhase('details');
  };

  // Calculate satisfaction score
  const calculateSatisfactionScore = () => {
    if (rankedRequirements.length === 0) return 0;
    const totalScore = rankedRequirements.reduce((sum, req) => sum + (req.currentMatch || 3), 0);
    const maxScore = rankedRequirements.length * 5;
    return Math.round((totalScore / maxScore) * 100);
  };

  // Get card color based on fulfillment score
  const getCardColor = (score) => {
    switch(score) {
      case 1: return 'red';
      case 2: return 'orange';
      case 3: return 'yellow';
      case 4: return 'blue';
      case 5: return 'green';
      default: return 'gray';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl mb-4">
          <Target className="text-white" size={40} />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Define Your Work Requirements
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          What matters most in your ideal work environment? Select and prioritize your top requirements.
        </p>
      </motion.div>

      {/* Phase Indicator */}
      <div className="flex items-center justify-center space-x-2">
        {['selection', 'ranking', 'details'].map((p, index) => (
          <React.Fragment key={p}>
            <motion.div
              className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                phase === p
                  ? 'bg-orange-500 text-white'
                  : ['selection', 'ranking', 'details'].indexOf(phase) > index
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
              }`}
            >
              {['selection', 'ranking', 'details'].indexOf(phase) > index ? (
                <Check size={20} />
              ) : (
                index + 1
              )}
            </motion.div>
            {index < 2 && (
              <div className={`w-20 h-1 ${
                ['selection', 'ranking', 'details'].indexOf(phase) > index
                  ? 'bg-green-500'
                  : 'bg-gray-200'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-center space-x-12 text-sm text-gray-600">
        <span className={phase === 'selection' ? 'font-semibold text-orange-600' : ''}>Select</span>
        <span className={phase === 'ranking' ? 'font-semibold text-orange-600' : ''}>Rank</span>
        <span className={phase === 'details' ? 'font-semibold text-orange-600' : ''}>Detail</span>
      </div>

      {/* Phase Content */}
      <AnimatePresence mode="wait">
        {phase === 'selection' && (
          <motion.div
            key="selection"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                  Select Your Top 10 Requirements
                </h3>
                <span className={`font-semibold ${
                  selectedRequirements.length === 10 ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {selectedRequirements.length}/10 selected
                </span>
              </div>

              {categories.map((category) => (
                <div key={category.id} className="mb-6">
                  <h4 className={`text-sm font-semibold text-${category.color}-700 mb-3 uppercase tracking-wider`}>
                    {category.label}
                  </h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {allRequirements
                      .filter(req => req.category === category.id)
                      .map((req) => {
                        const Icon = req.icon;
                        const isSelected = selectedRequirements.includes(req.id);
                        
                        return (
                          <motion.button
                            key={req.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleRequirement(req.id)}
                            disabled={!isSelected && selectedRequirements.length >= 10}
                            className={`flex items-center p-3 rounded-lg transition-all ${
                              isSelected
                                ? `bg-${category.color}-100 border-2 border-${category.color}-500`
                                : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                            } ${
                              !isSelected && selectedRequirements.length >= 10
                                ? 'opacity-50 cursor-not-allowed'
                                : ''
                            }`}
                          >
                            <Icon size={20} className={`mr-3 ${
                              isSelected ? `text-${category.color}-600` : 'text-gray-500'
                            }`} />
                            <span className={`text-sm font-medium ${
                              isSelected ? `text-${category.color}-700` : 'text-gray-700'
                            }`}>
                              {req.name}
                            </span>
                            {isSelected && (
                              <Check size={16} className={`ml-auto text-${category.color}-600`} />
                            )}
                          </motion.button>
                        );
                      })}
                  </div>
                </div>
              ))}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={proceedToRanking}
                disabled={selectedRequirements.length === 0}
                className={`w-full py-4 rounded-xl font-semibold transition-all ${
                  selectedRequirements.length > 0
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:shadow-lg'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Continue to Ranking ({selectedRequirements.length} selected)
              </motion.button>
            </div>
          </motion.div>
        )}

        {phase === 'ranking' && (
          <motion.div
            key="ranking"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">
                Rank by Importance (Drag to Reorder)
              </h3>
              <p className="text-gray-600 mb-6">
                1 = Most important, 10 = Least important (but still matters!)
              </p>

              <Reorder.Group
                axis="y"
                values={rankedRequirements}
                onReorder={updateRankOrder}
                className="space-y-3"
              >
                {rankedRequirements.map((req, index) => {
                  const Icon = req.icon;
                  const category = categories.find(c => c.id === req.category);
                  
                  return (
                    <Reorder.Item
                      key={req.id}
                      value={req}
                      className="cursor-move"
                    >
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        className={`bg-${category.color}-50 border-2 border-${category.color}-200 rounded-xl p-4 flex items-center`}
                      >
                        <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg font-bold text-lg mr-4">
                          {index + 1}
                        </div>
                        <Icon className={`text-${category.color}-600 mr-3`} size={24} />
                        <span className="font-medium text-gray-800 flex-1">{req.name}</span>
                        <GripVertical className="text-gray-400" size={20} />
                      </motion.div>
                    </Reorder.Item>
                  );
                })}
              </Reorder.Group>

              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPhase('selection')}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold"
                >
                  Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={saveAndProceed}
                  className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:shadow-lg"
                >
                  Continue to Details
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'details' && (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {/* Satisfaction Score */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 mb-6"
            >
              <h3 className="text-lg font-semibold mb-3">Overall Job Satisfaction Score</h3>
              <div className="flex items-center">
                <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${calculateSatisfactionScore()}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={`h-full ${
                      calculateSatisfactionScore() >= 80 ? 'bg-green-500' :
                      calculateSatisfactionScore() >= 60 ? 'bg-blue-500' :
                      calculateSatisfactionScore() >= 40 ? 'bg-yellow-500' :
                      calculateSatisfactionScore() >= 20 ? 'bg-orange-500' :
                      'bg-red-500'
                    }`}
                  />
                </div>
                <span className="ml-4 text-2xl font-bold">{calculateSatisfactionScore()}%</span>
              </div>
            </motion.div>
            {rankedRequirements.map((req, index) => {
              const Icon = req.icon;
              const category = categories.find(c => c.id === req.category);
              
              return (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-${getCardColor(req.currentMatch || 3)}-50 rounded-2xl shadow-lg p-6 border-2 border-${getCardColor(req.currentMatch || 3)}-200`}
                >
                  <div className="flex items-center mb-4">
                    <div className={`flex items-center justify-center w-12 h-12 bg-${category.color}-100 rounded-xl mr-4`}>
                      <span className="font-bold text-lg">#{req.rank}</span>
                    </div>
                    <Icon className={`text-${category.color}-600 mr-3`} size={24} />
                    <h4 className="text-lg font-semibold text-gray-800">{req.name}</h4>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Why is this important to you?
                      </label>
                      <textarea
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        rows="2"
                        placeholder="Explain your reasoning..."
                        value={req.importance || ''}
                        onChange={(e) => updateRequirementDetails(req.id, 'importance', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        How well does your current job fulfill this? ({req.currentMatch || 3}/5)
                      </label>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">Not at all</span>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={req.currentMatch || 3}
                          onChange={(e) => updateRequirementDetails(req.id, 'currentMatch', parseInt(e.target.value))}
                          className="flex-1"
                        />
                        <span className="text-sm text-gray-500">Fully</span>
                      </div>
                      <div className="flex justify-center mt-2">
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((score) => (
                            <div
                              key={score}
                              className={`w-8 h-2 rounded-full ${
                                score <= (req.currentMatch || 3)
                                  ? score <= 2 ? 'bg-red-400' : score === 3 ? 'bg-yellow-400' : 'bg-green-400'
                                  : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPhase('ranking')}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold"
              >
                Back to Ranking
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleComplete}
                className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:shadow-lg"
              >
                Complete
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedWorkRequirementsStep;
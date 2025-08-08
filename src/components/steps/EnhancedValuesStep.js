import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Sparkles, Check, X, AlertCircle, GripVertical,
  Heart, Shield, Target, Zap, Users, Lightbulb,
  Trophy, Compass, Star
} from 'lucide-react';

// Sortable Value Item Component
const SortableValueItem = ({ value, rank, isDragging }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: value.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const Icon = value.icon;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={`bg-white border-2 rounded-xl p-4 flex items-center ${
        isDragging ? 'opacity-50' : ''
      } ${rank <= 5 ? 'border-purple-300 bg-purple-50' : 'border-gray-200'}`}
      whileHover={{ scale: 1.02 }}
    >
      <div className={`flex items-center justify-center w-10 h-10 rounded-lg font-bold mr-4 ${
        rank <= 5 ? 'bg-purple-200 text-purple-700' : 'bg-gray-100 text-gray-600'
      }`}>
        {rank}
      </div>
      <Icon className={rank <= 5 ? 'text-purple-600' : 'text-gray-500'} size={24} />
      <span className="ml-3 font-medium text-gray-800 flex-1">{value.name}</span>
      <div {...attributes} {...listeners} className="cursor-move">
        <GripVertical className="text-gray-400" size={20} />
      </div>
    </motion.div>
  );
};

const EnhancedValuesStep = ({ formData, updateFormData }) => {
  const [phase, setPhase] = useState('selection'); // selection, top10, top5, ranking
  const [selectedValues, setSelectedValues] = useState(formData.values?.all || []);
  const [top10Values, setTop10Values] = useState(formData.values?.top10 || []);
  const [top5Values, setTop5Values] = useState(formData.values?.top5 || []);
  const [rankedTop5, setRankedTop5] = useState(formData.values?.top5 || []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const allValues = [
    // Personal Values
    { id: 'integrity', name: 'Integrity', icon: Shield, category: 'personal' },
    { id: 'authenticity', name: 'Authenticity', icon: Heart, category: 'personal' },
    { id: 'honesty', name: 'Honesty', icon: Shield, category: 'personal' },
    { id: 'respect', name: 'Respect', icon: Users, category: 'personal' },
    { id: 'compassion', name: 'Compassion', icon: Heart, category: 'personal' },
    
    // Growth Values
    { id: 'growth', name: 'Growth', icon: Zap, category: 'growth' },
    { id: 'learning', name: 'Learning', icon: Lightbulb, category: 'growth' },
    { id: 'innovation', name: 'Innovation', icon: Sparkles, category: 'growth' },
    { id: 'creativity', name: 'Creativity', icon: Sparkles, category: 'growth' },
    { id: 'curiosity', name: 'Curiosity', icon: Compass, category: 'growth' },
    
    // Achievement Values
    { id: 'excellence', name: 'Excellence', icon: Trophy, category: 'achievement' },
    { id: 'achievement', name: 'Achievement', icon: Trophy, category: 'achievement' },
    { id: 'success', name: 'Success', icon: Star, category: 'achievement' },
    { id: 'recognition', name: 'Recognition', icon: Star, category: 'achievement' },
    { id: 'impact', name: 'Impact', icon: Target, category: 'achievement' },
    
    // Social Values
    { id: 'collaboration', name: 'Collaboration', icon: Users, category: 'social' },
    { id: 'community', name: 'Community', icon: Users, category: 'social' },
    { id: 'service', name: 'Service', icon: Heart, category: 'social' },
    { id: 'leadership', name: 'Leadership', icon: Compass, category: 'social' },
    { id: 'mentorship', name: 'Mentorship', icon: Users, category: 'social' },
    
    // Lifestyle Values
    { id: 'balance', name: 'Balance', icon: Shield, category: 'lifestyle' },
    { id: 'freedom', name: 'Freedom', icon: Zap, category: 'lifestyle' },
    { id: 'flexibility', name: 'Flexibility', icon: Zap, category: 'lifestyle' },
    { id: 'autonomy', name: 'Autonomy', icon: Compass, category: 'lifestyle' },
    { id: 'adventure', name: 'Adventure', icon: Compass, category: 'lifestyle' },
    
    // Security Values
    { id: 'stability', name: 'Stability', icon: Shield, category: 'security' },
    { id: 'security', name: 'Security', icon: Shield, category: 'security' },
    { id: 'trust', name: 'Trust', icon: Shield, category: 'security' },
    { id: 'loyalty', name: 'Loyalty', icon: Heart, category: 'security' },
    { id: 'responsibility', name: 'Responsibility', icon: Target, category: 'security' }
  ];

  const categories = [
    { id: 'personal', label: 'Personal Integrity', color: 'blue' },
    { id: 'growth', label: 'Growth & Development', color: 'green' },
    { id: 'achievement', label: 'Achievement & Success', color: 'yellow' },
    { id: 'social', label: 'Social & Relationships', color: 'pink' },
    { id: 'lifestyle', label: 'Lifestyle & Freedom', color: 'purple' },
    { id: 'security', label: 'Security & Stability', color: 'gray' }
  ];

  const toggleValue = (valueId) => {
    if (selectedValues.includes(valueId)) {
      setSelectedValues(selectedValues.filter(id => id !== valueId));
    } else {
      setSelectedValues([...selectedValues, valueId]);
    }
  };

  const proceedToTop10 = () => {
    if (selectedValues.length >= 10) {
      setTop10Values(selectedValues.slice(0, 10));
      setPhase('top10');
    }
  };

  const narrowToTop10 = (valueId) => {
    if (top10Values.includes(valueId)) {
      if (top10Values.length > 10) {
        setTop10Values(top10Values.filter(id => id !== valueId));
      }
    } else {
      setTop10Values([...top10Values, valueId]);
    }
  };

  const proceedToTop5 = () => {
    if (top10Values.length === 10) {
      setTop5Values([]); // Start with empty selection for manual picking
      setPhase('top5');
    }
  };

  const narrowToTop5 = (valueId) => {
    if (top5Values.includes(valueId)) {
      // Allow deselection
      setTop5Values(top5Values.filter(id => id !== valueId));
    } else if (top5Values.length < 5) {
      // Allow selection up to 5
      setTop5Values([...top5Values, valueId]);
    }
  };

  const proceedToRanking = () => {
    if (top5Values.length === 5) {
      setRankedTop5(top5Values);
      setPhase('ranking');
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setRankedTop5((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const saveValues = () => {
    updateFormData('values', {
      all: selectedValues,
      top10: top10Values,
      top5: rankedTop5
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl mb-4">
          <Sparkles className="text-white" size={40} />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Discover Your Core Values
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Through a process of reflection and prioritization, identify the 5 values that matter most to you.
        </p>
      </motion.div>

      {/* Phase Indicator */}
      <div className="flex items-center justify-center space-x-8 mb-8">
        {[
          { id: 'selection', label: 'Select All' },
          { id: 'top10', label: 'Top 10' },
          { id: 'top5', label: 'Top 5' },
          { id: 'ranking', label: 'Rank' }
        ].map((p, index) => (
          <div key={p.id} className="flex flex-col items-center">
            <motion.div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold mb-2 ${
                phase === p.id
                  ? 'bg-purple-500 text-white'
                  : ['selection', 'top10', 'top5', 'ranking'].indexOf(phase) > index
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
              }`}
            >
              {['selection', 'top10', 'top5', 'ranking'].indexOf(phase) > index ? (
                <Check size={20} />
              ) : (
                index + 1
              )}
            </motion.div>
            <span className={`text-sm ${phase === p.id ? 'font-semibold text-purple-600' : 'text-gray-500'}`}>
              {p.label}
            </span>
          </div>
        ))}
      </div>

      {/* Phase Content */}
      <AnimatePresence mode="wait">
        {/* Phase 1: Initial Selection */}
        {phase === 'selection' && (
          <motion.div
            key="selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">
                  Select All Values That Resonate With You
                </h3>
                <span className="text-lg font-medium text-purple-600">
                  {selectedValues.length} selected
                </span>
              </div>

              {categories.map((category) => (
                <div key={category.id} className="mb-6">
                  <h4 className={`text-sm font-semibold text-${category.color}-700 mb-3 uppercase tracking-wider`}>
                    {category.label}
                  </h4>
                  <div className="grid md:grid-cols-3 gap-2">
                    {allValues
                      .filter(val => val.category === category.id)
                      .map((value) => {
                        const Icon = value.icon;
                        const isSelected = selectedValues.includes(value.id);
                        
                        return (
                          <motion.button
                            key={value.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleValue(value.id)}
                            className={`flex items-center p-3 rounded-lg transition-all ${
                              isSelected
                                ? 'bg-purple-100 border-2 border-purple-500'
                                : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                            }`}
                          >
                            <Icon size={20} className={`mr-2 ${
                              isSelected ? 'text-purple-600' : 'text-gray-500'
                            }`} />
                            <span className={`text-sm font-medium ${
                              isSelected ? 'text-purple-700' : 'text-gray-700'
                            }`}>
                              {value.name}
                            </span>
                          </motion.button>
                        );
                      })}
                  </div>
                </div>
              ))}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={proceedToTop10}
                disabled={selectedValues.length < 10}
                className={`w-full py-4 rounded-xl font-semibold transition-all ${
                  selectedValues.length >= 10
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:shadow-lg'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {selectedValues.length < 10
                  ? `Select at least ${10 - selectedValues.length} more values`
                  : 'Continue to Top 10'}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Phase 2: Narrow to Top 10 */}
        {phase === 'top10' && (
          <motion.div
            key="top10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">
                  Narrow Down to Your Top 10 Values
                </h3>
                <span className={`text-lg font-medium ${
                  top10Values.length === 10 ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {top10Values.length}/10 selected
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                {selectedValues.map((valueId) => {
                  const value = allValues.find(v => v.id === valueId);
                  const Icon = value.icon;
                  const isInTop10 = top10Values.includes(valueId);
                  
                  return (
                    <motion.button
                      key={valueId}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => narrowToTop10(valueId)}
                      className={`flex items-center p-4 rounded-xl transition-all ${
                        isInTop10
                          ? 'bg-purple-100 border-2 border-purple-500'
                          : 'bg-gray-50 border-2 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <Icon size={24} className={`mr-3 ${
                        isInTop10 ? 'text-purple-600' : 'text-gray-500'
                      }`} />
                      <span className={`font-medium ${
                        isInTop10 ? 'text-purple-700' : 'text-gray-700'
                      }`}>
                        {value.name}
                      </span>
                      {isInTop10 && (
                        <Check size={20} className="ml-auto text-purple-600" />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {top10Values.length > 10 && (
                <div className="mt-4 p-4 bg-orange-50 rounded-lg flex items-center">
                  <AlertCircle className="text-orange-600 mr-2" size={20} />
                  <span className="text-orange-700">
                    Please deselect {top10Values.length - 10} value{top10Values.length - 10 > 1 ? 's' : ''} to continue
                  </span>
                </div>
              )}

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
                  onClick={proceedToTop5}
                  disabled={top10Values.length !== 10}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                    top10Values.length === 10
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:shadow-lg'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Continue to Top 5
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Phase 3: Narrow to Top 5 */}
        {phase === 'top5' && (
          <motion.div
            key="top5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">
                  Select Your 5 Core Values
                </h3>
                <span className={`text-lg font-medium ${
                  top5Values.length === 5 ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {top5Values.length}/5 selected
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                {top10Values.map((valueId) => {
                  const value = allValues.find(v => v.id === valueId);
                  const Icon = value.icon;
                  const isInTop5 = top5Values.includes(valueId);
                  
                  return (
                    <motion.button
                      key={valueId}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => narrowToTop5(valueId)}
                      disabled={!isInTop5 && top5Values.length >= 5}
                      className={`flex items-center p-4 rounded-xl transition-all ${
                        isInTop5
                          ? 'bg-purple-100 border-2 border-purple-500'
                          : 'bg-gray-50 border-2 border-gray-200 hover:bg-gray-100'
                      } ${
                        !isInTop5 && top5Values.length >= 5
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }`}
                    >
                      <Icon size={24} className={`mr-3 ${
                        isInTop5 ? 'text-purple-600' : 'text-gray-500'
                      }`} />
                      <span className={`font-medium ${
                        isInTop5 ? 'text-purple-700' : 'text-gray-700'
                      }`}>
                        {value.name}
                      </span>
                      {isInTop5 && (
                        <Check size={20} className="ml-auto text-purple-600" />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPhase('top10')}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold"
                >
                  Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={proceedToRanking}
                  disabled={top5Values.length !== 5}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                    top5Values.length === 5
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:shadow-lg'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Continue to Ranking
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Phase 4: Rank Top 5 */}
        {phase === 'ranking' && (
          <motion.div
            key="ranking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-2">
                Rank Your Core Values
              </h3>
              <p className="text-gray-600 mb-6">
                Drag to reorder from most important (1) to least important (5)
              </p>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={rankedTop5}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {rankedTop5.map((valueId, index) => {
                      const value = allValues.find(v => v.id === valueId);
                      return (
                        <SortableValueItem
                          key={valueId}
                          value={value}
                          rank={index + 1}
                        />
                      );
                    })}
                  </div>
                </SortableContext>
              </DndContext>

              <div className="mt-8 p-4 bg-purple-50 rounded-xl">
                <h4 className="font-semibold text-purple-800 mb-2">Your Core Values:</h4>
                <ol className="space-y-1">
                  {rankedTop5.map((valueId, index) => {
                    const value = allValues.find(v => v.id === valueId);
                    return (
                      <li key={valueId} className="text-purple-700">
                        {index + 1}. {value.name}
                      </li>
                    );
                  })}
                </ol>
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPhase('top5')}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold"
                >
                  Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={saveValues}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-semibold hover:shadow-lg"
                >
                  Save My Values
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedValuesStep;
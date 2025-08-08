import React from 'react';

const WheelOfLifeStep = ({ formData, updateFormData }) => {
  const categories = [
    { key: 'health', label: 'Health', description: 'Physical wellbeing, fitness, nutrition, sleep' },
    { key: 'career', label: 'Career', description: 'Job satisfaction, professional growth, skills' },
    { key: 'relationships', label: 'Relationships', description: 'Family, friends, social connections' },
    { key: 'personalGrowth', label: 'Personal Growth', description: 'Learning, self-improvement' },
    { key: 'finances', label: 'Finances', description: 'Financial health, savings, investments' },
    { key: 'funRecreation', label: 'Fun & Recreation', description: 'Hobbies, relaxation, leisure' },
    { key: 'spirituality', label: 'Spirituality', description: 'Purpose, values, beliefs' },
    { key: 'physicalEnvironment', label: 'Environment', description: 'Living space, workspace, surroundings' }
  ];

  const updateWheel = (category, value) => {
    updateFormData('wheelOfLife', {
      ...formData.wheelOfLife,
      [category]: parseInt(value)
    });
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Wheel of Life Assessment</h2>
        <p className="text-gray-600">
          Rate your satisfaction in each life area from 1 (very unsatisfied) to 10 (very satisfied).
        </p>
      </div>

      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category.key} className="space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-800">{category.label}</h3>
                <p className="text-sm text-gray-600">{category.description}</p>
              </div>
              <span className="text-2xl font-bold text-teal-600">
                {formData.wheelOfLife[category.key]}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.wheelOfLife[category.key]}
              onChange={(e) => updateWheel(category.key, e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #14b8a6 0%, #14b8a6 ${
                  (formData.wheelOfLife[category.key] - 1) * 11.11
                }%, #e5e7eb ${(formData.wheelOfLife[category.key] - 1) * 11.11}%, #e5e7eb 100%)`
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WheelOfLifeStep;
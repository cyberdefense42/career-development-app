import React, { useState } from 'react';

const ValuesStep = ({ formData, updateFormData }) => {
  const values = [
    'Integrity', 'Innovation', 'Excellence', 'Collaboration', 'Growth',
    'Balance', 'Recognition', 'Security', 'Freedom', 'Creativity',
    'Service', 'Leadership', 'Learning', 'Achievement', 'Respect',
    'Trust', 'Fun', 'Challenge', 'Impact', 'Authenticity'
  ];

  const [selectedValues, setSelectedValues] = useState(formData.values || []);

  const toggleValue = (value) => {
    const updated = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    
    if (updated.length <= 5) {
      setSelectedValues(updated);
      updateFormData('values', updated);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Your Core Values</h2>
        <p className="text-gray-600">
          Select the 5 values that resonate most strongly with you.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {values.map((value) => (
          <button
            key={value}
            onClick={() => toggleValue(value)}
            disabled={!selectedValues.includes(value) && selectedValues.length >= 5}
            className={`p-4 rounded-lg text-sm font-medium transition-all ${
              selectedValues.includes(value)
                ? 'bg-teal-600 text-white transform scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } ${
              !selectedValues.includes(value) && selectedValues.length >= 5
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
          >
            {value}
          </button>
        ))}
      </div>

      {selectedValues.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Top Values:</h3>
          <div className="flex flex-wrap gap-2">
            {selectedValues.map((value, index) => (
              <span
                key={value}
                className="px-4 py-2 bg-teal-100 text-teal-800 rounded-full font-medium"
              >
                {index + 1}. {value}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ValuesStep;

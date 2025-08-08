import React, { useState } from 'react';

const StrengthsStep = ({ formData, updateFormData }) => {
  // Ensure formData.strengths exists and has the right structure
  const initialStrengths = formData.strengths && formData.strengths.length > 0 
    ? [...formData.strengths, ...Array(5 - formData.strengths.length).fill('')]
    : ['', '', '', '', ''];
    
  const [strengths, setStrengths] = useState(initialStrengths.slice(0, 5));

  const updateStrength = (index, value) => {
    const newStrengths = [...strengths];
    newStrengths[index] = value;
    setStrengths(newStrengths);
    updateFormData('strengths', newStrengths.filter(s => s));
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Identify Your Strengths</h2>
        <p className="text-gray-600">
          List your top strengths based on your work experience and feedback you've received.
        </p>
      </div>

      <div className="space-y-4">
        {strengths.map((strength, index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Strength {index + 1}
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              placeholder="e.g., Problem-solving, Communication, Leadership..."
              value={strength}
              onChange={(e) => updateStrength(index, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-teal-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-3">💡 Tips for identifying strengths:</h3>
        <ul className="space-y-2 text-gray-700">
          <li>• Think about tasks that come naturally to you</li>
          <li>• Consider compliments you frequently receive</li>
          <li>• Reflect on activities that energize you</li>
          <li>• Ask colleagues what they see as your strengths</li>
        </ul>
      </div>
    </div>
  );
};

export default StrengthsStep;

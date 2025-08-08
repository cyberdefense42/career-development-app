import React, { useState } from 'react';

const WorkRequirementsStep = ({ formData, updateFormData }) => {
  const requirements = [
    'Work-life balance',
    'Professional development opportunities',
    'Flexible working hours',
    'Remote work options',
    'Competitive salary',
    'Health benefits',
    'Team collaboration',
    'Recognition and appreciation',
    'Job security',
    'Creative freedom',
    'Clear career progression',
    'Mentorship programs',
    'Company culture fit',
    'Meaningful work',
    'Autonomy'
  ];

  const [selectedRequirements, setSelectedRequirements] = useState(
    formData.workRequirements || []
  );

  const toggleRequirement = (req) => {
    const updated = selectedRequirements.includes(req)
      ? selectedRequirements.filter(r => r !== req)
      : [...selectedRequirements, req];
    
    if (updated.length <= 10) {
      setSelectedRequirements(updated);
      updateFormData('workRequirements', updated);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Your Work Requirements</h2>
        <p className="text-gray-600">
          Select the workplace factors that are most important to you (choose up to 10).
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {requirements.map((req) => (
          <button
            key={req}
            onClick={() => toggleRequirement(req)}
            disabled={!selectedRequirements.includes(req) && selectedRequirements.length >= 10}
            className={`p-3 rounded-lg text-sm font-medium transition-all ${
              selectedRequirements.includes(req)
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } ${
              !selectedRequirements.includes(req) && selectedRequirements.length >= 10
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
          >
            {req}
          </button>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <p className="text-blue-800">
          <strong>Selected:</strong> {selectedRequirements.length}/10 requirements
        </p>
      </div>
    </div>
  );
};

export default WorkRequirementsStep;
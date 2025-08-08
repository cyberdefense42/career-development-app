import React from 'react';
import { CheckCircle } from 'lucide-react';

const SummaryStep = ({ formData }) => {
  // Provide default values to prevent undefined errors
  const safeFormData = {
    problemStatement: formData.problemStatement || '',
    rootCause: formData.rootCause || '',
    values: formData.values || [],
    workRequirements: formData.workRequirements || [],
    strengths: formData.strengths || [],
    dreamJob: formData.dreamJob || {},
    wheelOfLife: formData.wheelOfLife || {
      health: 5,
      career: 5,
      relationships: 5,
      personalGrowth: 5,
      finances: 5,
      funRecreation: 5,
      spirituality: 5,
      physicalEnvironment: 5
    },
    workTasks: formData.workTasks || []
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <CheckCircle className="mx-auto mb-4 text-teal-600" size={64} />
        <h2 className="text-3xl font-bold text-gray-800 mb-3">Your Career Development Summary</h2>
        <p className="text-gray-600">Here's a comprehensive overview of your self-assessment results.</p>
      </div>

      <div className="space-y-6">
        {/* Problem Analysis */}
        {safeFormData.problemStatement && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold text-lg text-gray-800 mb-3">🔍 Problem Analysis</h3>
            <p className="text-gray-700 mb-2"><strong>Challenge:</strong> {safeFormData.problemStatement}</p>
            {safeFormData.rootCause && (
              <p className="text-gray-700"><strong>Root Cause:</strong> {safeFormData.rootCause}</p>
            )}
          </div>
        )}

        {/* Values */}
        {safeFormData.values.length > 0 && (
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="font-semibold text-lg text-gray-800 mb-3">✨ Your Core Values</h3>
            <div className="flex flex-wrap gap-2">
              {safeFormData.values.map((value, index) => (
                <span key={value} className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full">
                  {value}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Work Requirements */}
        {safeFormData.workRequirements.length > 0 && (
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="font-semibold text-lg text-gray-800 mb-3">📋 Your Work Requirements</h3>
            <div className="grid grid-cols-2 gap-2">
              {safeFormData.workRequirements.map((req, index) => (
                <div key={index} className="text-gray-700">• {req}</div>
              ))}
            </div>
          </div>
        )}

        {/* Strengths */}
        {safeFormData.strengths.length > 0 && (
          <div className="bg-teal-50 p-6 rounded-lg">
            <h3 className="font-semibold text-lg text-gray-800 mb-3">💪 Your Strengths</h3>
            <ul className="list-disc list-inside text-gray-700">
              {safeFormData.strengths.map((strength, index) => (
                strength && <li key={index}>{strength}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Work Tasks Energy Balance */}
        {safeFormData.workTasks.length > 0 && (
          <div className="bg-yellow-50 p-6 rounded-lg">
            <h3 className="font-semibold text-lg text-gray-800 mb-3">⚡ Work Tasks Energy Balance</h3>
            <div className="space-y-2">
              {safeFormData.workTasks.slice(0, 5).map((task, index) => (
                <div key={index} className="text-gray-700">
                  • {task.name} (Energy: {task.energyLevel > 0 ? '+' : ''}{task.energyLevel})
                </div>
              ))}
              {safeFormData.workTasks.length > 5 && (
                <p className="text-gray-600 italic">...and {safeFormData.workTasks.length - 5} more tasks</p>
              )}
            </div>
          </div>
        )}

        {/* Dream Job */}
        {safeFormData.dreamJob.title && (
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="font-semibold text-lg text-gray-800 mb-3">🎯 Your Dream Job</h3>
            <p className="text-gray-700 mb-2"><strong>Title:</strong> {safeFormData.dreamJob.title}</p>
            {safeFormData.dreamJob.description && (
              <p className="text-gray-700">{safeFormData.dreamJob.description}</p>
            )}
          </div>
        )}

        {/* Wheel of Life */}
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="font-semibold text-lg text-gray-800 mb-3">🎡 Life Balance Scores</h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(safeFormData.wheelOfLife).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                <span className="font-bold text-teal-600">{value}/10</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg">
        <h3 className="font-semibold text-xl mb-3">🚀 Next Steps</h3>
        <p className="mb-3">
          Based on your assessment, consider these actions:
        </p>
        <ul className="space-y-2">
          <li>• Review your values and ensure your work aligns with them</li>
          <li>• Focus on roles that leverage your identified strengths</li>
          <li>• Address the root causes of your workplace challenges</li>
          <li>• Create an action plan to move toward your dream job</li>
          <li>• Work on improving areas with low satisfaction scores</li>
        </ul>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => window.print()}
          className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
        >
          Print Summary
        </button>
      </div>
    </div>
  );
};

export default SummaryStep;

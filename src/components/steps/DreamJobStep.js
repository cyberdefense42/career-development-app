import React, { useState } from 'react';

const DreamJobStep = ({ formData, updateFormData }) => {
  const [dreamJob, setDreamJob] = useState(formData.dreamJob || {
    title: '',
    description: '',
    environment: '',
    impact: '',
    dailyActivities: ''
  });

  const updateDreamJob = (field, value) => {
    const updated = { ...dreamJob, [field]: value };
    setDreamJob(updated);
    updateFormData('dreamJob', updated);
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Visualize Your Dream Job</h2>
        <p className="text-gray-600">
          Imagine your ideal work situation without any limitations.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dream Job Title
          </label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            placeholder="What would your ideal position be called?"
            value={dreamJob.title}
            onChange={(e) => updateDreamJob('title', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Description
          </label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            rows="3"
            placeholder="Describe what this role would entail..."
            value={dreamJob.description}
            onChange={(e) => updateDreamJob('description', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Work Environment
          </label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            rows="2"
            placeholder="Describe your ideal workplace (office, remote, team size, culture...)"
            value={dreamJob.environment}
            onChange={(e) => updateDreamJob('environment', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Impact & Purpose
          </label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            rows="2"
            placeholder="What impact would you make in this role?"
            value={dreamJob.impact}
            onChange={(e) => updateDreamJob('impact', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Daily Activities
          </label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            rows="2"
            placeholder="What would a typical day look like?"
            value={dreamJob.dailyActivities}
            onChange={(e) => updateDreamJob('dailyActivities', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default DreamJobStep;
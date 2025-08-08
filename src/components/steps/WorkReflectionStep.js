import React, { useState } from 'react';

const WorkReflectionStep = ({ formData, updateFormData }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ name: '', energyLevel: 0, skill: 'medium' });

  const energyLevels = [
    { value: -3, label: 'Very energy-draining', color: 'bg-red-600' },
    { value: -2, label: 'Moderately energy-draining', color: 'bg-red-400' },
    { value: -1, label: 'Slightly energy-draining', color: 'bg-red-300' },
    { value: 0, label: 'Neutral', color: 'bg-gray-400' },
    { value: 1, label: 'Slightly energizing', color: 'bg-green-300' },
    { value: 2, label: 'Moderately energizing', color: 'bg-green-400' },
    { value: 3, label: 'Very energizing', color: 'bg-green-600' }
  ];

  const addTask = () => {
    if (newTask.name) {
      const updatedTasks = [...tasks, { ...newTask, id: Date.now() }];
      setTasks(updatedTasks);
      setNewTask({ name: '', energyLevel: 0, skill: 'medium' });
      updateFormData('workTasks', updatedTasks);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Energy Balance Assessment</h2>
        <p className="text-gray-600">
          List your work tasks and rate how they affect your energy levels.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex gap-4">
          <input
            type="text"
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            placeholder="Enter a work task or activity..."
            value={newTask.name}
            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
          />
          <button
            onClick={addTask}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Add Task
          </button>
        </div>

        {newTask.name && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-3">How does this task affect your energy?</p>
            <div className="flex gap-2 flex-wrap">
              {energyLevels.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setNewTask({ ...newTask, energyLevel: level.value })}
                  className={`px-3 py-2 rounded text-white text-sm ${
                    newTask.energyLevel === level.value ? level.color : 'bg-gray-300'
                  }`}
                >
                  {level.value}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Tasks:</h3>
          <div className="space-y-2">
            {tasks.map((task) => {
              const energy = energyLevels.find(l => l.value === task.energyLevel);
              return (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{task.name}</span>
                  <span className={`px-3 py-1 rounded-full text-white text-sm ${energy.color}`}>
                    {energy.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkReflectionStep;
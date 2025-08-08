import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Battery, Zap, TrendingUp, TrendingDown,
  BarChart3, Clock, Target, AlertCircle
} from 'lucide-react';

const WorkReflectionMatrixStep = ({ formData, updateFormData }) => {
  const [tasks, setTasks] = useState(formData.workTasks || []);
  const [showMatrix, setShowMatrix] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({
    name: '',
    energy: 0,
    skill: 2,
    currentTime: 3,
    futureTime: 3
  });

  const energyLevels = [
    { value: -3, label: 'Very draining', color: 'red', intensity: 600 },
    { value: -2, label: 'Moderately draining', color: 'red', intensity: 400 },
    { value: -1, label: 'Slightly draining', color: 'red', intensity: 300 },
    { value: 0, label: 'Neutral', color: 'gray', intensity: 400 },
    { value: 1, label: 'Slightly energizing', color: 'green', intensity: 300 },
    { value: 2, label: 'Moderately energizing', color: 'green', intensity: 400 },
    { value: 3, label: 'Very energizing', color: 'green', intensity: 600 }
  ];

  const skillLevels = [
    { value: 1, label: 'Low skill', icon: '🔴' },
    { value: 2, label: 'Medium skill', icon: '🟡' },
    { value: 3, label: 'High skill', icon: '🟢' }
  ];

  // Calculate derived values
  const calculateTaskMetrics = (task) => {
    // Enjoyment score based on energy (per requirements)
    let enjoyment;
    if (task.energy > 0) {
      enjoyment = 3; // Like
    } else if (task.energy < 0) {
      enjoyment = 1; // Dislike  
    } else {
      enjoyment = 0; // Neutral (when energy = 0)
    }

    // Impact score = Energy × Enjoyment
    const impact = task.energy * enjoyment;

    // Determine matrix position
    let impactCategory, skillCategory;
    
    if (impact < 0) impactCategory = 'negative';
    else if (impact === 0) impactCategory = 'neutral';
    else impactCategory = 'positive';

    if (task.skill < 2) skillCategory = 'low';
    else if (task.skill === 2) skillCategory = 'medium';
    else skillCategory = 'high';

    return {
      enjoyment,
      impact,
      impactCategory,
      skillCategory,
      matrixCell: `${impactCategory}-${skillCategory}`
    };
  };

  const addTask = () => {
    if (newTask.name) {
      const taskWithId = {
        ...newTask,
        id: Date.now(),
        ...calculateTaskMetrics(newTask)
      };
      const updatedTasks = [...tasks, taskWithId];
      setTasks(updatedTasks);
      updateFormData('workTasks', updatedTasks);
      setNewTask({
        name: '',
        energy: 0,
        skill: 2,
        currentTime: 3,
        futureTime: 3
      });
      setIsAddingTask(false);
    }
  };

  const updateTask = (taskId, updates) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, ...updates };
        return { ...updatedTask, ...calculateTaskMetrics(updatedTask) };
      }
      return task;
    });
    setTasks(updatedTasks);
    updateFormData('workTasks', updatedTasks);
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter(t => t.id !== taskId);
    setTasks(updatedTasks);
    updateFormData('workTasks', updatedTasks);
  };

  // Matrix data
  const getMatrixData = () => {
    const matrix = {
      'negative-low': { tasks: [], totalTime: 0, label: 'Eliminate', color: 'red', advice: 'Delegate or stop these tasks' },
      'negative-medium': { tasks: [], totalTime: 0, label: 'Minimize', color: 'orange', advice: 'Reduce time or improve process' },
      'negative-high': { tasks: [], totalTime: 0, label: 'Transform', color: 'yellow', advice: 'Redesign to be more energizing' },
      'neutral-low': { tasks: [], totalTime: 0, label: 'Learn', color: 'gray', advice: 'Develop skills if valuable' },
      'neutral-medium': { tasks: [], totalTime: 0, label: 'Maintain', color: 'gray', advice: 'Keep as necessary tasks' },
      'neutral-high': { tasks: [], totalTime: 0, label: 'Optimize', color: 'gray', advice: 'Make more impactful' },
      'positive-low': { tasks: [], totalTime: 0, label: 'Develop', color: 'lightgreen', advice: 'Build skills to excel' },
      'positive-medium': { tasks: [], totalTime: 0, label: 'Expand', color: 'green', advice: 'Increase involvement' },
      'positive-high': { tasks: [], totalTime: 0, label: 'Maximize', color: 'darkgreen', advice: 'Your sweet spot - do more!' }
    };

    tasks.forEach(task => {
      const metrics = calculateTaskMetrics(task);
      const cell = metrics.matrixCell;
      if (matrix[cell]) {
        matrix[cell].tasks.push(task);
        matrix[cell].totalTime += task.currentTime;
      }
    });

    return matrix;
  };

  const matrixData = getMatrixData();

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl mb-4">
          <BarChart3 className="text-white" size={40} />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Work Reflection & Energy Analysis
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Map your tasks based on energy impact and skill level to optimize your work life.
        </p>
      </motion.div>

      {/* Add Task Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Plus className="mr-2" size={24} />
          Add Work Task
        </h3>

        {!isAddingTask ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAddingTask(true)}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Add New Task
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-4"
          >
            <input
              type="text"
              placeholder="Task name (e.g., Team meetings, Report writing)"
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={newTask.name}
              onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
            />

            {/* Energy Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Energy Level: <span className="text-lg font-semibold">{newTask.energy}</span>
              </label>
              <div className="flex gap-2 flex-wrap">
                {energyLevels.map((level) => (
                  <motion.button
                    key={level.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setNewTask({ ...newTask, energy: level.value })}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      newTask.energy === level.value
                        ? `bg-${level.color}-${level.intensity} text-white`
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {level.value > 0 && '+'}{level.value}
                  </motion.button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">{energyLevels.find(l => l.value === newTask.energy)?.label}</p>
            </div>

            {/* Skill Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skill Level
              </label>
              <div className="flex gap-3">
                {skillLevels.map((level) => (
                  <motion.button
                    key={level.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setNewTask({ ...newTask, skill: level.value })}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                      newTask.skill === level.value
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span className="mr-2">{level.icon}</span>
                    {level.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Current Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Time Spent (1-5 scale)
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={newTask.currentTime}
                onChange={(e) => setNewTask({ ...newTask, currentTime: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Very little (1)</span>
                <span>Little (2)</span>
                <span>Moderate (3)</span>
                <span>Much (4)</span>
                <span>Very much (5)</span>
              </div>
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addTask}
                disabled={!newTask.name}
                className="flex-1 py-3 bg-green-500 text-white rounded-xl font-semibold disabled:opacity-50"
              >
                Add Task
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsAddingTask(false);
                  setNewTask({ name: '', energy: 0, skill: 2, currentTime: 3, futureTime: 3 });
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Tasks List */}
      {tasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Your Tasks ({tasks.length})</h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowMatrix(!showMatrix)}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-medium"
            >
              {showMatrix ? 'Hide' : 'Show'} Matrix View
            </motion.button>
          </div>

          {!showMatrix ? (
            // List View
            <div className="space-y-3">
              {tasks.map((task, index) => {
                const energy = energyLevels.find(l => l.value === task.energy);
                const skill = skillLevels.find(l => l.value === task.skill);
                
                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl shadow-md p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{task.name}</h4>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className={`px-2 py-1 rounded bg-${energy.color}-100 text-${energy.color}-700`}>
                            Energy: {task.energy > 0 && '+'}{task.energy}
                          </span>
                          <span className="text-gray-600">
                            {skill.icon} {skill.label}
                          </span>
                          <span className="text-gray-600">
                            Enjoyment: {task.enjoyment === 3 ? 'Like' : task.enjoyment === 1 ? 'Dislike' : 'Neutral'}
                          </span>
                          <span className="text-gray-600 flex items-center">
                            <Clock size={14} className="mr-1" />
                            Time: {task.currentTime}/5
                          </span>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => deleteTask(task.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </div>

                    {/* Future Time Planning */}
                    <div className="mt-4 pt-4 border-t">
                      <label className="text-sm text-gray-600">
                        Desired future time: <span className="font-semibold">{task.futureTime}/5</span>
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={task.futureTime || 3}
                        onChange={(e) => updateTask(task.id, { futureTime: parseInt(e.target.value) })}
                        className="w-full mt-1"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            // Matrix View
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h4 className="text-lg font-semibold mb-4">Energy-Skill Matrix</h4>
              <div className="grid grid-cols-3 gap-4">
                {['high', 'medium', 'low'].map((skillLevel) => (
                  ['negative', 'neutral', 'positive'].map((impactLevel) => {
                    const cellKey = `${impactLevel}-${skillLevel}`;
                    const cellData = matrixData[cellKey];
                    const bgColor = {
                      'negative-low': 'bg-red-100',
                      'negative-medium': 'bg-orange-100',
                      'negative-high': 'bg-yellow-100',
                      'neutral-low': 'bg-gray-100',
                      'neutral-medium': 'bg-gray-100',
                      'neutral-high': 'bg-gray-100',
                      'positive-low': 'bg-green-100',
                      'positive-medium': 'bg-green-200',
                      'positive-high': 'bg-green-300'
                    }[cellKey];

                    return (
                      <motion.div
                        key={cellKey}
                        whileHover={{ scale: 1.02 }}
                        className={`${bgColor} rounded-xl p-4 min-h-[150px]`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h5 className="font-semibold text-sm">{cellData.label}</h5>
                            <p className="text-xs text-gray-600 mt-1">{cellData.advice}</p>
                          </div>
                          {cellData.totalTime > 0 && (
                            <span className="text-lg font-bold">{cellData.totalTime}</span>
                          )}
                        </div>
                        <div className="space-y-1 mt-3">
                          {cellData.tasks.map((task) => (
                            <div key={task.id} className="text-xs bg-white/50 rounded px-2 py-1">
                              {task.name}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    );
                  })
                ))}
              </div>
              <div className="mt-4 flex items-center justify-center text-sm text-gray-600">
                <div className="flex items-center gap-8">
                  <div className="flex items-center">
                    <TrendingDown className="mr-2 text-red-500" size={20} />
                    <span>Negative Impact</span>
                  </div>
                  <div className="flex items-center">
                    <Zap className="mr-2 text-gray-500" size={20} />
                    <span>Neutral Impact</span>
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="mr-2 text-green-500" size={20} />
                    <span>Positive Impact</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Tips */}
      {tasks.length === 0 && !isAddingTask && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-blue-50 rounded-2xl p-6 text-center"
        >
          <AlertCircle className="mx-auto text-blue-500 mb-3" size={48} />
          <p className="text-blue-800 font-medium">Start by adding your regular work tasks</p>
          <p className="text-blue-600 text-sm mt-2">
            Think about meetings, reports, emails, projects, and any recurring activities
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default WorkReflectionMatrixStep;
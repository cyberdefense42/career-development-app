import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, Briefcase, Users, FileText, X, 
  Sparkles, Zap,
  ExternalLink, UserPlus, Lightbulb, Star
} from 'lucide-react';

const EnhancedStrengthsStep = ({ formData, updateFormData }) => {
  const [activeTab, setActiveTab] = useState('work');
  const [strengths, setStrengths] = useState(formData.strengths || {
    fromWork: [],
    fromTests: [],
    fromFriends: []
  });

  // Get high-skill tasks from work reflection
  const getHighSkillTasks = () => {
    if (!formData.workTasks) return [];
    return formData.workTasks.filter(task => 
      task.skill >= 2 && (task.skill === 3 || task.energy > 0)
    );
  };

  const [workStrengths, setWorkStrengths] = useState(() => {
    const existing = strengths.fromWork || [];
    const tasks = getHighSkillTasks();
    return tasks.map(task => ({
      taskName: task.name,
      taskId: task.id,
      strengths: existing.find(ws => ws.taskId === task.id)?.strengths || ['', '', '', '', '']
    }));
  });

  const [testStrengths, setTestStrengths] = useState(
    strengths.fromTests || Array(5).fill('')
  );

  const [friendFeedback, setFriendFeedback] = useState(
    strengths.fromFriends || [
      { name: '', strengths: ['', '', ''] },
      { name: '', strengths: ['', '', ''] },
      { name: '', strengths: ['', '', ''] }
    ]
  );

  const tabs = [
    { id: 'work', label: 'From Work', icon: Briefcase, color: 'blue' },
    { id: 'tests', label: 'From Tests', icon: FileText, color: 'green' },
    { id: 'friends', label: 'From Friends', icon: Users, color: 'purple' }
  ];

  const updateWorkStrength = (taskIndex, strengthIndex, value) => {
    const updated = [...workStrengths];
    updated[taskIndex].strengths[strengthIndex] = value;
    setWorkStrengths(updated);
    updateStrengthsData();
  };

  const updateTestStrength = (index, value) => {
    const updated = [...testStrengths];
    updated[index] = value;
    setTestStrengths(updated);
    updateStrengthsData();
  };

  const updateFriendFeedback = (friendIndex, field, value) => {
    const updated = [...friendFeedback];
    if (field === 'name') {
      updated[friendIndex].name = value;
    } else {
      const strengthIndex = parseInt(field);
      updated[friendIndex].strengths[strengthIndex] = value;
    }
    setFriendFeedback(updated);
    updateStrengthsData();
  };

  const addFriend = () => {
    setFriendFeedback([...friendFeedback, { name: '', strengths: ['', '', ''] }]);
  };

  const removeFriend = (index) => {
    const updated = friendFeedback.filter((_, i) => i !== index);
    setFriendFeedback(updated);
    updateStrengthsData();
  };

  const updateStrengthsData = () => {
    const allStrengths = {
      fromWork: workStrengths.map(ws => ({
        taskId: ws.taskId,
        taskName: ws.taskName,
        strengths: ws.strengths.filter(s => s)
      })),
      fromTests: testStrengths.filter(s => s),
      fromFriends: friendFeedback.filter(f => f.name && f.strengths.some(s => s))
    };
    setStrengths(allStrengths);
    updateFormData('strengths', allStrengths);
  };

  const getAllUniqueStrengths = () => {
    const all = [];
    
    // From work
    workStrengths.forEach(ws => {
      ws.strengths.forEach(s => {
        if (s && !all.includes(s.toLowerCase())) {
          all.push(s.toLowerCase());
        }
      });
    });
    
    // From tests
    testStrengths.forEach(s => {
      if (s && !all.includes(s.toLowerCase())) {
        all.push(s.toLowerCase());
      }
    });
    
    // From friends
    friendFeedback.forEach(friend => {
      friend.strengths.forEach(s => {
        if (s && !all.includes(s.toLowerCase())) {
          all.push(s.toLowerCase());
        }
      });
    });
    
    return all;
  };

  const strengthExamples = [
    'Problem-solving', 'Communication', 'Leadership', 'Creativity', 'Analysis',
    'Empathy', 'Organization', 'Adaptability', 'Strategic thinking', 'Collaboration',
    'Innovation', 'Attention to detail', 'Presentation', 'Negotiation', 'Coaching'
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl mb-4">
          <Award className="text-white" size={40} />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Discover Your Strengths
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Identify your unique abilities through multiple perspectives - your work experience, assessments, and peer feedback.
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex justify-center space-x-2 mb-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? `bg-${tab.color}-500 text-white shadow-lg`
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon size={20} className="mr-2" />
              {tab.label}
            </motion.button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {/* Work-Based Strengths */}
        {activeTab === 'work' && (
          <motion.div
            key="work"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {workStrengths.length === 0 ? (
              <div className="bg-blue-50 rounded-2xl p-8 text-center">
                <Briefcase className="mx-auto text-blue-400 mb-4" size={48} />
                <p className="text-blue-800 font-medium text-lg">No high-skill tasks found</p>
                <p className="text-blue-600 mt-2">
                  Complete the Work Reflection section first to identify tasks where you excel
                </p>
              </div>
            ) : (
              <>
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-blue-800 font-medium">
                    Based on your work reflection, these tasks show high skill or positive impact:
                  </p>
                </div>

                {workStrengths.map((taskStrength, taskIndex) => (
                  <motion.div
                    key={taskStrength.taskId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: taskIndex * 0.1 }}
                    className="bg-white rounded-xl shadow-lg p-6"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <Zap className="text-blue-600" size={20} />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-800">
                        {taskStrength.taskName}
                      </h4>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">
                      What strengths help you excel at this task? (List up to 5)
                    </p>

                    <div className="space-y-3">
                      {taskStrength.strengths.map((strength, strengthIndex) => (
                        <div key={strengthIndex} className="flex items-center">
                          <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-medium mr-3">
                            {strengthIndex + 1}
                          </span>
                          <input
                            type="text"
                            className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder={`e.g., ${strengthExamples[strengthIndex * 3 % strengthExamples.length]}`}
                            value={strength}
                            onChange={(e) => updateWorkStrength(taskIndex, strengthIndex, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </>
            )}
          </motion.div>
        )}

        {/* Test-Based Strengths */}
        {activeTab === 'tests' && (
          <motion.div
            key="tests"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                <FileText className="mr-2" size={20} />
                Strength Assessment Results
              </h3>
              <p className="text-green-700 mb-4">
                Take a strengths assessment and enter your top 5 results below.
              </p>
              <a
                href="https://high5test.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-colors"
              >
                Take the High5 Test
                <ExternalLink size={16} className="ml-2" />
              </a>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h4 className="text-lg font-semibold mb-4">Your Top 5 Strengths</h4>
              <div className="space-y-3">
                {testStrengths.map((strength, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center"
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-green-600 font-bold">{index + 1}</span>
                    </div>
                    <input
                      type="text"
                      className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder={`Strength ${index + 1}`}
                      value={strength}
                      onChange={(e) => updateTestStrength(index, e.target.value)}
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-600">
                <strong>Other popular assessments:</strong> StrengthsFinder 2.0, VIA Character Strengths, 16Personalities
              </p>
            </div>
          </motion.div>
        )}

        {/* Friend Feedback */}
        {activeTab === 'friends' && (
          <motion.div
            key="friends"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="bg-purple-50 rounded-xl p-6">
              <h3 className="font-semibold text-purple-800 mb-3 flex items-center">
                <Users className="mr-2" size={20} />
                Peer Feedback Exercise
              </h3>
              <p className="text-purple-700 mb-3">
                Ask 3-5 close friends or colleagues: "What do you see as my top 3 strengths?"
              </p>
              <div className="bg-white rounded-lg p-4 text-sm text-gray-600">
                <p className="font-medium mb-2">Sample message:</p>
                <p className="italic">
                  "Hi! I'm working on understanding my strengths better. Could you share what you see as my top 3 strengths? 
                  I really value your perspective!"
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {friendFeedback.map((friend, friendIndex) => (
                <motion.div
                  key={friendIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: friendIndex * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <input
                      type="text"
                      className="text-lg font-semibold bg-transparent border-b-2 border-gray-200 focus:border-purple-500 outline-none px-1"
                      placeholder={`Friend ${friendIndex + 1}'s Name`}
                      value={friend.name}
                      onChange={(e) => updateFriendFeedback(friendIndex, 'name', e.target.value)}
                    />
                    {friendIndex >= 3 && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => removeFriend(friendIndex)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <X size={18} />
                      </motion.button>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-3">Their top 3 strengths for you:</p>
                  <div className="space-y-2">
                    {friend.strengths.map((strength, strengthIndex) => (
                      <div key={strengthIndex} className="flex items-center">
                        <Star className="text-purple-400 mr-3" size={16} />
                        <input
                          type="text"
                          className="flex-1 p-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder={`Strength ${strengthIndex + 1}`}
                          value={strength}
                          onChange={(e) => updateFriendFeedback(friendIndex, strengthIndex.toString(), e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {friendFeedback.length < 5 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addFriend}
                className="w-full py-3 border-2 border-dashed border-purple-300 rounded-xl text-purple-600 font-medium hover:bg-purple-50 transition-colors flex items-center justify-center"
              >
                <UserPlus size={20} className="mr-2" />
                Add Another Friend
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Consolidated Strengths Summary */}
      {getAllUniqueStrengths().length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold text-teal-800 mb-4 flex items-center">
            <Sparkles className="mr-2" size={24} />
            Your Consolidated Strengths
          </h3>
          <div className="flex flex-wrap gap-2">
            {getAllUniqueStrengths().map((strength, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="px-4 py-2 bg-white text-teal-700 rounded-full font-medium shadow-sm"
              >
                {strength}
              </motion.span>
            ))}
          </div>
          <p className="text-sm text-teal-600 mt-4">
            Total unique strengths identified: {getAllUniqueStrengths().length}
          </p>
        </motion.div>
      )}

      {/* Tips */}
      <div className="bg-amber-50 rounded-xl p-6">
        <h4 className="font-semibold text-amber-800 mb-3 flex items-center">
          <Lightbulb className="mr-2" size={20} />
          Tips for Identifying Strengths
        </h4>
        <ul className="space-y-2 text-amber-700 text-sm">
          <li>• Look for tasks that feel effortless but others find difficult</li>
          <li>• Notice what others frequently ask for your help with</li>
          <li>• Pay attention to compliments you receive regularly</li>
          <li>• Consider activities that make you lose track of time</li>
          <li>• Think about what you enjoyed doing as a child</li>
        </ul>
      </div>
    </div>
  );
};

export default EnhancedStrengthsStep;
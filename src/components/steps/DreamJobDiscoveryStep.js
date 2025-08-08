import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, Lightbulb, Target, Compass,
  Heart, Users, TrendingUp, Sparkles,
  ArrowRight, Palette, Code, Calculator, MessageSquare,
  Trees, Star, Brain, Hammer,
  Globe, Shield, ChevronDown, ChevronUp,
  ExternalLink, BookOpen, Award
} from 'lucide-react';

const DreamJobDiscoveryStep = ({ formData, updateFormData }) => {
  const [approach, setApproach] = useState('ai-matching'); // 'data', 'guided', or 'ai-matching'
  const [selectedThemes, setSelectedThemes] = useState(formData.dreamJob?.themes || []);
  const [categoryRatings, setCategoryRatings] = useState(formData.dreamJob?.categories || {});
  const [jobVision, setJobVision] = useState(formData.dreamJob?.vision || {
    doing: '',
    withWhom: '',
    how: '',
    why: ''
  });
  const [expandedCalculation, setExpandedCalculation] = useState(false);
  const [selectedArchetypes, setSelectedArchetypes] = useState(formData.dreamJob?.selectedArchetypes || []);

  // Define 9 Career Archetypes
  const careerArchetypes = [
    {
      id: 'synthesizer',
      name: 'The Synthesizer',
      icon: Brain,
      color: 'blue',
      description: 'Connects dots across disciplines and finds patterns',
      keyTraits: ['Systems thinking', 'Pattern recognition', 'Cross-functional collaboration'],
      careers: ['Business Analyst', 'Product Manager', 'Research Director'],
      values: ['Innovation', 'Learning', 'Impact', 'Intellectual Challenge'],
      energizingTasks: ['analyzing', 'researching', 'problem-solving', 'strategizing'],
      strengths: ['analytical', 'strategic', 'systems', 'critical thinking'],
      workRequirements: ['intellectual stimulation', 'variety', 'autonomy']
    },
    {
      id: 'creator',
      name: 'The Creator',
      icon: Palette,
      color: 'purple',
      description: 'Brings new ideas to life through innovation and artistry',
      keyTraits: ['Creativity', 'Innovation', 'Artistic expression'],
      careers: ['Creative Director', 'UX Designer', 'Content Creator'],
      values: ['Creativity', 'Self-expression', 'Innovation', 'Authenticity'],
      energizingTasks: ['designing', 'creating', 'brainstorming', 'writing'],
      strengths: ['creativity', 'design', 'innovation', 'artistic'],
      workRequirements: ['creative freedom', 'flexible schedule', 'inspiring environment']
    },
    {
      id: 'coach',
      name: 'The Coach',
      icon: Users,
      color: 'green',
      description: 'Develops others and builds strong relationships',
      keyTraits: ['Empathy', 'Teaching', 'Relationship building'],
      careers: ['HR Manager', 'Life Coach', 'Training Director'],
      values: ['Service', 'Growth', 'Relationships', 'Community'],
      energizingTasks: ['teaching', 'mentoring', 'coaching', 'facilitating'],
      strengths: ['empathy', 'communication', 'teaching', 'coaching'],
      workRequirements: ['people interaction', 'meaningful work', 'collaboration']
    },
    {
      id: 'leader',
      name: 'The Leader',
      icon: Compass,
      color: 'orange',
      description: 'Guides vision and drives organizational success',
      keyTraits: ['Leadership', 'Vision', 'Decision-making'],
      careers: ['Executive', 'Team Lead', 'Entrepreneur'],
      values: ['Leadership', 'Impact', 'Achievement', 'Influence'],
      energizingTasks: ['leading', 'strategizing', 'decision-making', 'influencing'],
      strengths: ['leadership', 'strategy', 'vision', 'influence'],
      workRequirements: ['leadership opportunities', 'high impact', 'decision authority']
    },
    {
      id: 'analyst',
      name: 'The Analyst',
      icon: Calculator,
      color: 'indigo',
      description: 'Dives deep into data and complex problems',
      keyTraits: ['Analysis', 'Research', 'Critical thinking'],
      careers: ['Data Scientist', 'Financial Analyst', 'Researcher'],
      values: ['Accuracy', 'Logic', 'Discovery', 'Excellence'],
      energizingTasks: ['analyzing', 'researching', 'calculating', 'investigating'],
      strengths: ['analytical', 'research', 'data', 'problem-solving'],
      workRequirements: ['intellectual challenge', 'detailed work', 'quiet environment']
    },
    {
      id: 'communicator',
      name: 'The Communicator',
      icon: MessageSquare,
      color: 'pink',
      description: 'Shares stories and connects with audiences',
      keyTraits: ['Communication', 'Storytelling', 'Persuasion'],
      careers: ['Marketing Manager', 'Journalist', 'Sales Director'],
      values: ['Communication', 'Influence', 'Connection', 'Expression'],
      energizingTasks: ['presenting', 'writing', 'networking', 'storytelling'],
      strengths: ['communication', 'persuasion', 'writing', 'presentation'],
      workRequirements: ['audience interaction', 'variety', 'public speaking']
    },
    {
      id: 'builder',
      name: 'The Builder',
      icon: Hammer,
      color: 'emerald',
      description: 'Creates tangible solutions and systems',
      keyTraits: ['Implementation', 'Construction', 'Practical solutions'],
      careers: ['Software Engineer', 'Project Manager', 'Operations Manager'],
      values: ['Craftsmanship', 'Results', 'Quality', 'Progress'],
      energizingTasks: ['building', 'implementing', 'developing', 'executing'],
      strengths: ['technical', 'implementation', 'execution', 'practical'],
      workRequirements: ['hands-on work', 'measurable results', 'technical challenges']
    },
    {
      id: 'explorer',
      name: 'The Explorer',
      icon: Globe,
      color: 'teal',
      description: 'Seeks new experiences and pushes boundaries',
      keyTraits: ['Adventure', 'Discovery', 'Risk-taking'],
      careers: ['Consultant', 'Field Researcher', 'Business Development'],
      values: ['Adventure', 'Freedom', 'Discovery', 'Growth'],
      energizingTasks: ['exploring', 'traveling', 'networking', 'discovering'],
      strengths: ['adaptability', 'curiosity', 'networking', 'innovation'],
      workRequirements: ['variety', 'travel', 'new challenges', 'flexibility']
    },
    {
      id: 'harmonizer',
      name: 'The Harmonizer',
      icon: Shield,
      color: 'amber',
      description: 'Creates balance and ensures smooth operations',
      keyTraits: ['Organization', 'Balance', 'Process improvement'],
      careers: ['Operations Director', 'Chief of Staff', 'Program Manager'],
      values: ['Harmony', 'Efficiency', 'Stability', 'Service'],
      energizingTasks: ['organizing', 'coordinating', 'optimizing', 'supporting'],
      strengths: ['organization', 'coordination', 'efficiency', 'process'],
      workRequirements: ['structured environment', 'team support', 'clear processes']
    }
  ];

  // Extract insights from previous modules
  const getPersonalInsights = () => {
    const insights = {
      strengths: [],
      values: formData.values?.top5 || [],
      highEnergyTasks: [],
      topRequirements: [],
      satisfyingAreas: []
    };

    // Get all strengths
    if (formData.strengths) {
      formData.strengths.fromWork?.forEach(ws => {
        insights.strengths.push(...ws.strengths.filter(s => s));
      });
      insights.strengths.push(...(formData.strengths.fromTests || []).filter(s => s));
      formData.strengths.fromFriends?.forEach(friend => {
        insights.strengths.push(...friend.strengths.filter(s => s));
      });
    }

    // Get high-energy tasks
    if (formData.workTasks) {
      insights.highEnergyTasks = formData.workTasks
        .filter(task => task.energy >= 2)
        .map(task => task.name);
    }

    // Get top work requirements
    if (formData.workRequirements) {
      insights.topRequirements = formData.workRequirements
        .slice(0, 5)
        .map(req => req.name);
    }

    // Get satisfying life areas
    if (formData.wheelOfLife) {
      const wheel = formData.wheelOfLife;
      ['health', 'career', 'relationships', 'personalGrowth', 'finances', 'funRecreation', 'spirituality', 'environment']
        .forEach(area => {
          if (wheel[area] >= 2) {
            insights.satisfyingAreas.push(area);
          }
        });
    }

    return insights;
  };

  const insights = getPersonalInsights();

  // AI-Powered Matching Algorithm
  const calculateArchetypeMatch = (archetype) => {
    let totalScore = 0;
    let weights = {
      values: 0.25,
      energizingTasks: 0.20,
      strengths: 0.20,
      workRequirements: 0.15,
      lifeBalance: 0.10,
      selectedArchetypes: 0.10
    };

    // Values alignment (25% weight)
    const valueMatches = insights.values.filter(value => 
      archetype.values.some(archetypeValue => 
        archetypeValue.toLowerCase().includes(value.toLowerCase()) ||
        value.toLowerCase().includes(archetypeValue.toLowerCase())
      )
    ).length;
    const valueScore = Math.min(valueMatches / Math.max(insights.values.length, 1), 1) * 100;
    totalScore += valueScore * weights.values;

    // High-energy tasks (20% weight)
    const taskMatches = insights.highEnergyTasks.filter(task =>
      archetype.energizingTasks.some(archetypeTask =>
        task.toLowerCase().includes(archetypeTask.toLowerCase()) ||
        archetypeTask.toLowerCase().includes(task.toLowerCase())
      )
    ).length;
    const taskScore = Math.min(taskMatches / Math.max(insights.highEnergyTasks.length, 1), 1) * 100;
    totalScore += taskScore * weights.energizingTasks;

    // Strengths alignment (20% weight)
    const strengthMatches = insights.strengths.filter(strength =>
      archetype.strengths.some(archetypeStrength =>
        strength.toLowerCase().includes(archetypeStrength.toLowerCase()) ||
        archetypeStrength.toLowerCase().includes(strength.toLowerCase())
      )
    ).length;
    const strengthScore = Math.min(strengthMatches / Math.max(insights.strengths.length, 1), 1) * 100;
    totalScore += strengthScore * weights.strengths;

    // Work requirements (15% weight)
    const reqMatches = insights.topRequirements.filter(req =>
      archetype.workRequirements.some(archetypeReq =>
        req.toLowerCase().includes(archetypeReq.toLowerCase()) ||
        archetypeReq.toLowerCase().includes(req.toLowerCase())
      )
    ).length;
    const reqScore = Math.min(reqMatches / Math.max(insights.topRequirements.length, 1), 1) * 100;
    totalScore += reqScore * weights.workRequirements;

    // Life balance priorities (10% weight)
    const balanceScore = insights.satisfyingAreas.includes('career') ? 100 : 
                        insights.satisfyingAreas.length > 0 ? 50 : 25;
    totalScore += balanceScore * weights.lifeBalance;

    // Self-selected archetypes (10% weight)
    const selfSelectedScore = selectedArchetypes.includes(archetype.id) ? 100 : 0;
    totalScore += selfSelectedScore * weights.selectedArchetypes;

    return {
      score: Math.round(totalScore),
      breakdown: {
        values: Math.round(valueScore),
        tasks: Math.round(taskScore),
        strengths: Math.round(strengthScore),
        requirements: Math.round(reqScore),
        balance: Math.round(balanceScore),
        selfSelected: Math.round(selfSelectedScore)
      },
      matchingFactors: {
        values: insights.values.filter(value => 
          archetype.values.some(av => av.toLowerCase().includes(value.toLowerCase()))
        ),
        tasks: insights.highEnergyTasks.filter(task =>
          archetype.energizingTasks.some(at => task.toLowerCase().includes(at.toLowerCase()))
        ),
        strengths: insights.strengths.filter(strength =>
          archetype.strengths.some(as => strength.toLowerCase().includes(as.toLowerCase()))
        )
      }
    };
  };

  // Get top 3 matches
  const getTopMatches = () => {
    const matches = careerArchetypes.map(archetype => ({
      ...archetype,
      match: calculateArchetypeMatch(archetype)
    }));
    
    return matches
      .sort((a, b) => b.match.score - a.match.score)
      .slice(0, 3);
  };

  const topMatches = getTopMatches();

  // Job categories for guided approach
  const jobCategories = [
    { 
      id: 'creative', 
      label: 'Creative & Design', 
      icon: Palette, 
      color: 'purple',
      examples: 'Designer, Writer, Artist, Musician, Content Creator',
      traits: ['Creativity', 'Innovation', 'Artistic expression']
    },
    { 
      id: 'technical', 
      label: 'Technical & Analytical', 
      icon: Code, 
      color: 'blue',
      examples: 'Engineer, Developer, Data Scientist, Analyst',
      traits: ['Problem-solving', 'Logic', 'Technical skills']
    },
    { 
      id: 'people', 
      label: 'People & Coaching', 
      icon: Users, 
      color: 'green',
      examples: 'Coach, Teacher, HR, Therapist, Consultant',
      traits: ['Empathy', 'Communication', 'Teaching']
    },
    { 
      id: 'leadership', 
      label: 'Leadership & Strategy', 
      icon: Compass, 
      color: 'orange',
      examples: 'Manager, Director, CEO, Strategist',
      traits: ['Leadership', 'Vision', 'Decision-making']
    },
    { 
      id: 'analytical', 
      label: 'Research & Analysis', 
      icon: Calculator, 
      color: 'indigo',
      examples: 'Researcher, Scientist, Academic, Analyst',
      traits: ['Analysis', 'Research', 'Critical thinking']
    },
    { 
      id: 'communication', 
      label: 'Communication & Media', 
      icon: MessageSquare, 
      color: 'pink',
      examples: 'Journalist, PR, Marketing, Sales, Speaker',
      traits: ['Communication', 'Persuasion', 'Storytelling']
    },
    { 
      id: 'nature', 
      label: 'Nature & Outdoors', 
      icon: Trees, 
      color: 'emerald',
      examples: 'Environmental Scientist, Park Ranger, Farmer',
      traits: ['Nature connection', 'Physical activity', 'Sustainability']
    },
    { 
      id: 'entrepreneurship', 
      label: 'Entrepreneurship', 
      icon: Rocket, 
      color: 'red',
      examples: 'Founder, Business Owner, Freelancer',
      traits: ['Innovation', 'Risk-taking', 'Independence']
    }
  ];

  // Identify recurring themes from insights
  const identifyThemes = () => {
    const themes = [];
    
    // Analyze strengths for patterns
    const strengthPatterns = {
      creative: ['creativity', 'design', 'artistic', 'innovation'],
      analytical: ['analysis', 'problem-solving', 'logic', 'data'],
      people: ['empathy', 'communication', 'teaching', 'coaching'],
      leadership: ['leadership', 'strategy', 'vision', 'management']
    };

    Object.entries(strengthPatterns).forEach(([theme, keywords]) => {
      const matches = insights.strengths.filter(strength => 
        keywords.some(keyword => strength.toLowerCase().includes(keyword))
      );
      if (matches.length > 0) {
        themes.push({
          type: theme,
          evidence: matches,
          source: 'strengths'
        });
      }
    });

    // Analyze values
    if (insights.values.includes('Creativity') || insights.values.includes('Innovation')) {
      themes.push({ type: 'creative', evidence: ['Values creativity/innovation'], source: 'values' });
    }
    if (insights.values.includes('Leadership') || insights.values.includes('Impact')) {
      themes.push({ type: 'leadership', evidence: ['Values leadership/impact'], source: 'values' });
    }
    if (insights.values.includes('Service') || insights.values.includes('Community')) {
      themes.push({ type: 'people', evidence: ['Values service/community'], source: 'values' });
    }

    return themes;
  };

  const toggleTheme = (theme) => {
    if (selectedThemes.includes(theme)) {
      setSelectedThemes(selectedThemes.filter(t => t !== theme));
    } else {
      setSelectedThemes([...selectedThemes, theme]);
    }
  };

  const updateCategoryRating = (categoryId, rating) => {
    const updated = { ...categoryRatings, [categoryId]: rating };
    setCategoryRatings(updated);
    updateFormData('dreamJob', {
      ...formData.dreamJob,
      categories: updated
    });
  };

  const updateVision = (field, value) => {
    const updated = { ...jobVision, [field]: value };
    setJobVision(updated);
    updateFormData('dreamJob', {
      ...formData.dreamJob,
      vision: updated
    });
  };

  const saveThemes = () => {
    updateFormData('dreamJob', {
      ...formData.dreamJob,
      themes: selectedThemes
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
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl mb-4">
          <Rocket className="text-white" size={40} />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Discover Your Dream Job
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Let's use everything you've learned about yourself to envision work that truly fits you.
        </p>
      </motion.div>

      {/* Approach Selection */}
      <div className="flex justify-center space-x-3 mb-8 flex-wrap">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setApproach('ai-matching')}
          className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all ${
            approach === 'ai-matching'
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Brain size={20} className="mr-2" />
          AI Career Matching
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setApproach('data')}
          className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all ${
            approach === 'data'
              ? 'bg-indigo-500 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Lightbulb size={20} className="mr-2" />
          Data-Driven Discovery
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setApproach('guided')}
          className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all ${
            approach === 'guided'
              ? 'bg-purple-500 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Compass size={20} className="mr-2" />
          Guided Exploration
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {/* AI Career Matching */}
        {approach === 'ai-matching' && (
          <motion.div
            key="ai-matching"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* Top 3 Career Matches */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
                Your Top Career Archetype Matches
              </h3>
              
              <div className="grid gap-6">
                {topMatches.map((match, index) => {
                  const Icon = match.icon;
                  const percentage = match.match.score;
                  
                  return (
                    <motion.div
                      key={match.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className={`relative bg-white rounded-2xl shadow-lg overflow-hidden border-2 ${
                        index === 0 ? 'border-yellow-300' : 'border-gray-200'
                      }`}
                    >
                      {index === 0 && (
                        <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                          <Award size={16} className="mr-1" />
                          Best Match
                        </div>
                      )}
                      
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start">
                            <div className={`w-16 h-16 bg-gradient-to-br from-${match.color}-400 to-${match.color}-600 rounded-2xl flex items-center justify-center mr-4`}>
                              <Icon className="text-white" size={32} />
                            </div>
                            <div>
                              <h4 className="text-xl font-bold text-gray-800">{match.name}</h4>
                              <p className="text-gray-600 mb-2">{match.description}</p>
                              <div className="flex flex-wrap gap-1">
                                {match.keyTraits.map((trait, idx) => (
                                  <span key={idx} className={`text-xs px-2 py-1 bg-${match.color}-100 text-${match.color}-700 rounded`}>
                                    {trait}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          {/* Circular Progress */}
                          <div className="relative w-20 h-20 flex-shrink-0">
                            <svg className="transform -rotate-90 w-20 h-20">
                              <circle
                                cx="40"
                                cy="40"
                                r="32"
                                stroke={`rgb(var(--color-${match.color}-200))`}
                                strokeWidth="6"
                                fill="none"
                              />
                              <circle
                                cx="40"
                                cy="40"
                                r="32"
                                stroke={`rgb(var(--color-${match.color}-500))`}
                                strokeWidth="6"
                                fill="none"
                                strokeDasharray={`${2 * Math.PI * 32}`}
                                strokeDashoffset={`${2 * Math.PI * 32 * (1 - percentage / 100)}`}
                                className="transition-all duration-1000"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className={`text-lg font-bold text-${match.color}-600`}>
                                {percentage}%
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Matching Factors */}
                        <div className="space-y-3 mb-4">
                          <h5 className="font-semibold text-gray-800">Key Matching Factors:</h5>
                          {match.match.matchingFactors.values.length > 0 && (
                            <div className="flex items-center">
                              <Heart size={16} className="text-red-500 mr-2" />
                              <span className="text-sm text-gray-600">
                                Values: {match.match.matchingFactors.values.join(', ')}
                              </span>
                            </div>
                          )}
                          {match.match.matchingFactors.strengths.length > 0 && (
                            <div className="flex items-center">
                              <Star size={16} className="text-amber-500 mr-2" />
                              <span className="text-sm text-gray-600">
                                Strengths: {match.match.matchingFactors.strengths.slice(0, 3).join(', ')}
                              </span>
                            </div>
                          )}
                          {match.match.matchingFactors.tasks.length > 0 && (
                            <div className="flex items-center">
                              <TrendingUp size={16} className="text-green-500 mr-2" />
                              <span className="text-sm text-gray-600">
                                Energizing tasks: {match.match.matchingFactors.tasks.slice(0, 3).join(', ')}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Suggested Career Fields */}
                        <div className="border-t pt-4">
                          <h5 className="font-semibold text-gray-800 mb-2">Suggested Career Directions:</h5>
                          <div className="flex flex-wrap gap-2">
                            {match.careers.map((career, idx) => (
                              <span key={idx} className={`px-3 py-1 bg-gradient-to-r from-${match.color}-500 to-${match.color}-600 text-white rounded-lg text-sm font-medium`}>
                                {career}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* How was this calculated? */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="bg-gray-50 rounded-2xl p-6"
            >
              <button
                onClick={() => setExpandedCalculation(!expandedCalculation)}
                className="w-full flex items-center justify-between text-left"
              >
                <h4 className="text-lg font-semibold text-gray-800">
                  How was this calculated?
                </h4>
                {expandedCalculation ? (
                  <ChevronUp className="text-gray-500" size={24} />
                ) : (
                  <ChevronDown className="text-gray-500" size={24} />
                )}
              </button>
              
              <AnimatePresence>
                {expandedCalculation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 space-y-4"
                  >
                    <p className="text-gray-600">
                      Your career archetype matches are calculated using a weighted algorithm that considers:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Values alignment</span>
                          <span className="font-semibold">25%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>High-energy tasks</span>
                          <span className="font-semibold">20%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Identified strengths</span>
                          <span className="font-semibold">20%</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Work requirements</span>
                          <span className="font-semibold">15%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Life balance priorities</span>
                          <span className="font-semibold">10%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Self-selected preferences</span>
                          <span className="font-semibold">10%</span>
                        </div>
                      </div>
                    </div>
                    
                    {topMatches.length > 0 && (
                      <div className="mt-4 p-4 bg-white rounded-lg">
                        <h5 className="font-semibold mb-2">Your top match breakdown:</h5>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span>Values ({topMatches[0].match.breakdown.values}%)</span>
                            <span>{Math.round(topMatches[0].match.breakdown.values * 0.25)} points</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tasks ({topMatches[0].match.breakdown.tasks}%)</span>
                            <span>{Math.round(topMatches[0].match.breakdown.tasks * 0.20)} points</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Strengths ({topMatches[0].match.breakdown.strengths}%)</span>
                            <span>{Math.round(topMatches[0].match.breakdown.strengths * 0.20)} points</span>
                          </div>
                          <div className="border-t pt-1 font-semibold flex justify-between">
                            <span>Total Match Score</span>
                            <span>{topMatches[0].match.score}%</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Career Path Suggestions */}
            {topMatches.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
                  Detailed Career Path Recommendations
                </h3>
                
                {topMatches.map((match, index) => {
                  const Icon = match.icon;
                  
                  // Define career paths for each archetype
                  const getCareerPaths = (archetypeId) => {
                    const paths = {
                      synthesizer: [
                        {
                          title: 'Strategic Business Analysis',
                          description: 'Bridge business and technology to drive strategic decisions',
                          requiredSkills: ['Data analysis', 'Business strategy', 'Communication', 'Systems thinking'],
                          nextSteps: ['Get certified in business analysis', 'Learn SQL and data visualization', 'Join strategic planning projects'],
                          communities: ['International Institute of Business Analysis', 'Strategic Planning Society']
                        },
                        {
                          title: 'Product Management',
                          description: 'Guide product strategy and connect user needs with business goals',
                          requiredSkills: ['User research', 'Agile methodology', 'Data analysis', 'Stakeholder management'],
                          nextSteps: ['Complete product management course', 'Build portfolio of product case studies', 'Practice product metrics'],
                          communities: ['Product Management Community', 'Mind the Product']
                        },
                        {
                          title: 'Management Consulting',
                          description: 'Solve complex business problems across industries',
                          requiredSkills: ['Problem solving', 'Presentation skills', 'Industry knowledge', 'Project management'],
                          nextSteps: ['Develop case study skills', 'Build consulting methodology knowledge', 'Network with consultants'],
                          communities: ['Management Consulting Network', 'Case Interview Community']
                        }
                      ],
                      creator: [
                        {
                          title: 'Creative Direction',
                          description: 'Lead creative vision and guide artistic teams',
                          requiredSkills: ['Design thinking', 'Team leadership', 'Brand strategy', 'Creative software'],
                          nextSteps: ['Build creative portfolio', 'Learn team management skills', 'Study brand strategy'],
                          communities: ['Creative Directors Network', 'Design Leadership Forum']
                        },
                        {
                          title: 'UX/Product Design',
                          description: 'Design user-centered digital experiences',
                          requiredSkills: ['User research', 'Prototyping', 'Design systems', 'Usability testing'],
                          nextSteps: ['Complete UX design course', 'Build design portfolio', 'Learn design tools'],
                          communities: ['UX Mastery Community', 'Interaction Design Association']
                        },
                        {
                          title: 'Content Strategy',
                          description: 'Create compelling content that drives engagement',
                          requiredSkills: ['Content planning', 'SEO', 'Analytics', 'Brand voice'],
                          nextSteps: ['Build content portfolio', 'Learn content marketing', 'Study audience analysis'],
                          communities: ['Content Marketing Institute', 'Content Strategy Alliance']
                        }
                      ],
                      coach: [
                        {
                          title: 'Organizational Development',
                          description: 'Help organizations improve culture and effectiveness',
                          requiredSkills: ['Change management', 'Group facilitation', 'Organizational psychology', 'Assessment tools'],
                          nextSteps: ['Get OD certification', 'Learn change management frameworks', 'Practice facilitation'],
                          communities: ['Organization Development Network', 'Association for Talent Development']
                        },
                        {
                          title: 'Executive Coaching',
                          description: 'Guide leaders to achieve their potential',
                          requiredSkills: ['Active listening', 'Leadership assessment', 'Goal setting', 'Emotional intelligence'],
                          nextSteps: ['Get coaching certification', 'Build coaching practice', 'Study leadership models'],
                          communities: ['International Coach Federation', 'Center for Executive Coaching']
                        },
                        {
                          title: 'Learning & Development',
                          description: 'Design and deliver training programs',
                          requiredSkills: ['Instructional design', 'Adult learning', 'Training delivery', 'Learning technology'],
                          nextSteps: ['Learn instructional design', 'Build training portfolio', 'Study learning theories'],
                          communities: ['Association for Talent Development', 'eLearning Guild']
                        }
                      ],
                      leader: [
                        {
                          title: 'Executive Leadership',
                          description: 'Drive organizational vision and strategic direction',
                          requiredSkills: ['Strategic thinking', 'Team building', 'Decision making', 'Financial acumen'],
                          nextSteps: ['Develop leadership philosophy', 'Gain P&L experience', 'Build executive presence'],
                          communities: ['Young Entrepreneur Organization', 'Executive Leadership Institute']
                        },
                        {
                          title: 'Entrepreneurship',
                          description: 'Build and scale innovative businesses',
                          requiredSkills: ['Risk management', 'Market analysis', 'Fundraising', 'Product development'],
                          nextSteps: ['Validate business ideas', 'Build MVP', 'Network with investors'],
                          communities: ['Entrepreneurs Organization', 'Startup Communities']
                        }
                      ],
                      analyst: [
                        {
                          title: 'Data Science',
                          description: 'Extract insights from complex datasets',
                          requiredSkills: ['Statistical analysis', 'Programming', 'Machine learning', 'Data visualization'],
                          nextSteps: ['Learn Python/R', 'Build data portfolio', 'Practice with real datasets'],
                          communities: ['Data Science Society', 'Kaggle Community']
                        },
                        {
                          title: 'Research & Strategy',
                          description: 'Conduct deep analysis to inform decisions',
                          requiredSkills: ['Research methodology', 'Critical thinking', 'Report writing', 'Market analysis'],
                          nextSteps: ['Build research portfolio', 'Learn advanced analytics', 'Study industry trends'],
                          communities: ['Market Research Society', 'Strategic Planning Institute']
                        }
                      ],
                      communicator: [
                        {
                          title: 'Content Marketing',
                          description: 'Create compelling content that drives engagement',
                          requiredSkills: ['Content strategy', 'SEO', 'Social media', 'Brand storytelling'],
                          nextSteps: ['Build content portfolio', 'Learn marketing automation', 'Study brand strategy'],
                          communities: ['Content Marketing Institute', 'Marketing Professionals Network']
                        },
                        {
                          title: 'Public Relations',
                          description: 'Manage brand reputation and media relationships',
                          requiredSkills: ['Media relations', 'Crisis communication', 'Event planning', 'Writing'],
                          nextSteps: ['Build PR portfolio', 'Practice media pitching', 'Study crisis management'],
                          communities: ['Public Relations Society', 'Communications Professionals']
                        }
                      ],
                      builder: [
                        {
                          title: 'Software Engineering',
                          description: 'Design and build scalable software systems',
                          requiredSkills: ['Programming languages', 'System design', 'Testing', 'DevOps'],
                          nextSteps: ['Build coding portfolio', 'Learn system architecture', 'Practice algorithms'],
                          communities: ['Stack Overflow', 'Developer Community']
                        },
                        {
                          title: 'Project Management',
                          description: 'Lead complex projects from conception to delivery',
                          requiredSkills: ['Project planning', 'Risk management', 'Team coordination', 'Agile methodology'],
                          nextSteps: ['Get PMP certification', 'Lead project initiatives', 'Learn agile frameworks'],
                          communities: ['Project Management Institute', 'Scrum Alliance']
                        }
                      ],
                      explorer: [
                        {
                          title: 'Business Development',
                          description: 'Identify and pursue new market opportunities',
                          requiredSkills: ['Market research', 'Relationship building', 'Negotiation', 'Strategic partnerships'],
                          nextSteps: ['Build network in target industries', 'Learn sales techniques', 'Study market trends'],
                          communities: ['Business Development Network', 'Sales Professionals Association']
                        },
                        {
                          title: 'International Consulting',
                          description: 'Solve business challenges across global markets',
                          requiredSkills: ['Cultural intelligence', 'Problem solving', 'Language skills', 'Travel flexibility'],
                          nextSteps: ['Gain international experience', 'Learn consulting frameworks', 'Build cultural competency'],
                          communities: ['International Association of Consultants', 'Global Business Network']
                        }
                      ],
                      harmonizer: [
                        {
                          title: 'Operations Management',
                          description: 'Optimize processes and ensure smooth operations',
                          requiredSkills: ['Process improvement', 'Quality management', 'Supply chain', 'Team coordination'],
                          nextSteps: ['Learn Lean Six Sigma', 'Study operations frameworks', 'Practice process mapping'],
                          communities: ['Operations Management Society', 'Lean Enterprise Institute']
                        },
                        {
                          title: 'Program Management',
                          description: 'Coordinate multiple projects and initiatives',
                          requiredSkills: ['Portfolio management', 'Stakeholder alignment', 'Resource planning', 'Communication'],
                          nextSteps: ['Get program management certification', 'Lead multi-project initiatives', 'Build stakeholder skills'],
                          communities: ['Program Management Institute', 'Portfolio Management Association']
                        }
                      ]
                    };
                    return paths[archetypeId] || [];
                  };

                  const careerPaths = getCareerPaths(match.id);
                  
                  return (
                    <motion.div
                      key={`paths-${match.id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.3 }}
                      className="bg-white rounded-2xl shadow-lg p-6"
                    >
                      <div className="flex items-center mb-6">
                        <div className={`w-12 h-12 bg-gradient-to-br from-${match.color}-400 to-${match.color}-600 rounded-xl flex items-center justify-center mr-4`}>
                          <Icon className="text-white" size={24} />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-gray-800">{match.name}</h4>
                          <p className="text-gray-600">Career Path Recommendations</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {careerPaths.map((path, pathIndex) => (
                          <div key={pathIndex} className="border-l-4 border-gray-200 pl-6">
                            <h5 className="text-lg font-semibold text-gray-800 mb-2">{path.title}</h5>
                            <p className="text-gray-600 mb-4">{path.description}</p>
                            
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                              {/* Required Skills */}
                              <div>
                                <h6 className="font-medium text-gray-800 mb-2 flex items-center">
                                  <BookOpen size={16} className="mr-2 text-blue-500" />
                                  Required Skills
                                </h6>
                                <div className="space-y-1">
                                  {path.requiredSkills.map((skill, idx) => {
                                    // Simple skills gap analysis
                                    const hasSkill = insights.strengths.some(strength => 
                                      strength.toLowerCase().includes(skill.toLowerCase()) ||
                                      skill.toLowerCase().includes(strength.toLowerCase())
                                    );
                                    
                                    return (
                                      <div key={idx} className="flex items-center">
                                        <div className={`w-2 h-2 rounded-full mr-2 ${hasSkill ? 'bg-green-500' : 'bg-orange-400'}`} />
                                        <span className={`text-sm ${hasSkill ? 'text-green-700' : 'text-gray-600'}`}>
                                          {skill} {hasSkill && '✓'}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Next Steps */}
                              <div>
                                <h6 className="font-medium text-gray-800 mb-2 flex items-center">
                                  <Target size={16} className="mr-2 text-purple-500" />
                                  Recommended Next Steps
                                </h6>
                                <div className="space-y-1">
                                  {path.nextSteps.map((step, idx) => (
                                    <div key={idx} className="flex items-start">
                                      <div className="w-2 h-2 rounded-full bg-purple-400 mr-2 mt-2 flex-shrink-0" />
                                      <span className="text-sm text-gray-600">{step}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Communities */}
                            <div>
                              <h6 className="font-medium text-gray-800 mb-2 flex items-center">
                                <Users size={16} className="mr-2 text-emerald-500" />
                                Relevant Communities
                              </h6>
                              <div className="flex flex-wrap gap-2">
                                {path.communities.map((community, idx) => (
                                  <span key={idx} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-sm flex items-center">
                                    {community}
                                    <ExternalLink size={12} className="ml-1" />
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Archetype Selection */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">
                Which archetypes resonate with you?
              </h3>
              <p className="text-gray-600 mb-4">
                Select any archetypes that feel like a good fit. This will improve future recommendations.
              </p>
              <div className="grid md:grid-cols-3 gap-3">
                {careerArchetypes.map((archetype) => {
                  const Icon = archetype.icon;
                  const isSelected = selectedArchetypes.includes(archetype.id);
                  
                  return (
                    <motion.button
                      key={archetype.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedArchetypes(selectedArchetypes.filter(id => id !== archetype.id));
                        } else {
                          setSelectedArchetypes([...selectedArchetypes, archetype.id]);
                        }
                        updateFormData('dreamJob', {
                          ...formData.dreamJob,
                          selectedArchetypes: isSelected 
                            ? selectedArchetypes.filter(id => id !== archetype.id)
                            : [...selectedArchetypes, archetype.id]
                        });
                      }}
                      className={`p-4 rounded-lg text-left transition-all border-2 ${
                        isSelected
                          ? `border-${archetype.color}-500 bg-${archetype.color}-50`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <Icon className={`mr-2 ${isSelected ? `text-${archetype.color}-600` : 'text-gray-400'}`} size={20} />
                        <span className="font-medium">{archetype.name}</span>
                      </div>
                      <p className="text-sm text-gray-600">{archetype.description}</p>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Data-Driven Approach */}
        {approach === 'data' && (
          <motion.div
            key="data"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Personal Insights Summary */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-indigo-800 mb-4">
                Your Personal Profile Summary
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                {/* Strengths */}
                {insights.strengths.length > 0 && (
                  <div className="bg-white rounded-xl p-4">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                      <Star className="mr-2 text-amber-500" size={18} />
                      Top Strengths
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {[...new Set(insights.strengths)].slice(0, 5).map((strength, idx) => (
                        <span key={idx} className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-sm">
                          {strength}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Values */}
                {insights.values.length > 0 && (
                  <div className="bg-white rounded-xl p-4">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                      <Heart className="mr-2 text-red-500" size={18} />
                      Core Values
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {insights.values.map((value, idx) => (
                        <span key={idx} className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm">
                          {value}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* High Energy Tasks */}
                {insights.highEnergyTasks.length > 0 && (
                  <div className="bg-white rounded-xl p-4">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                      <TrendingUp className="mr-2 text-green-500" size={18} />
                      Energizing Activities
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {insights.highEnergyTasks.slice(0, 4).map((task, idx) => (
                        <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
                          {task}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Work Requirements */}
                {insights.topRequirements.length > 0 && (
                  <div className="bg-white rounded-xl p-4">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                      <Target className="mr-2 text-blue-500" size={18} />
                      Must-Haves
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {insights.topRequirements.map((req, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Pattern Recognition */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">
                Recurring Themes in Your Profile
              </h3>
              <p className="text-gray-600 mb-4">
                Based on your answers, these patterns emerge:
              </p>
              
              <div className="space-y-3">
                {identifyThemes().map((theme, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start p-4 bg-gray-50 rounded-lg"
                  >
                    <Sparkles className="text-indigo-500 mt-1 mr-3 flex-shrink-0" size={20} />
                    <div>
                      <p className="font-medium text-gray-800 capitalize">{theme.type} orientation</p>
                      <p className="text-sm text-gray-600">
                        Evidence: {theme.evidence.join(', ')} (from {theme.source})
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Areas of Interest */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">
                What patterns or themes resonate with you?
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {['Creative work', 'Problem-solving', 'Helping others', 'Leading teams', 
                  'Working independently', 'Building things', 'Analyzing data', 'Teaching/Coaching'].map((theme) => (
                  <motion.button
                    key={theme}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleTheme(theme)}
                    className={`p-3 rounded-lg text-left transition-all ${
                      selectedThemes.includes(theme)
                        ? 'bg-indigo-100 border-2 border-indigo-500'
                        : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    <span className="font-medium">{theme}</span>
                  </motion.button>
                ))}
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Other areas that interest you:
                </label>
                <textarea
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows="3"
                  placeholder="List any job areas, fields, or roles you're curious about..."
                  onChange={(e) => saveThemes()}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Guided Approach */}
        {approach === 'guided' && (
          <motion.div
            key="guided"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Job Categories */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">
                Explore Job Categories
              </h3>
              <p className="text-gray-600 mb-6">
                Rate your interest in each category (1 = Not interested, 5 = Very interested)
              </p>

              <div className="space-y-4">
                {jobCategories.map((category, idx) => {
                  const Icon = category.icon;
                  const rating = categoryRatings[category.id] || 0;
                  
                  return (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        rating >= 4 ? `border-${category.color}-300 bg-${category.color}-50` : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start">
                          <div className={`w-12 h-12 bg-${category.color}-100 rounded-xl flex items-center justify-center mr-4`}>
                            <Icon className={`text-${category.color}-600`} size={24} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">{category.label}</h4>
                            <p className="text-sm text-gray-600 mt-1">{category.examples}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {category.traits.map((trait, idx) => (
                                <span key={idx} className={`text-xs px-2 py-1 bg-${category.color}-100 text-${category.color}-700 rounded`}>
                                  {trait}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 mr-2">Interest:</span>
                        {[1, 2, 3, 4, 5].map((score) => (
                          <motion.button
                            key={score}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => updateCategoryRating(category.id, score)}
                            className={`w-8 h-8 rounded-full font-medium text-sm transition-all ${
                              rating >= score
                                ? `bg-${category.color}-500 text-white`
                                : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                            }`}
                          >
                            {score}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Reflection Questions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-6">
                Design Your Ideal Job
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What am I doing?
                  </label>
                  <textarea
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows="3"
                    placeholder="Describe the activities and tasks in your ideal role..."
                    value={jobVision.doing}
                    onChange={(e) => updateVision('doing', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    With whom am I working?
                  </label>
                  <textarea
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows="2"
                    placeholder="Team size, types of colleagues, clients..."
                    value={jobVision.withWhom}
                    onChange={(e) => updateVision('withWhom', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How am I working?
                  </label>
                  <textarea
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows="2"
                    placeholder="Work environment, schedule, autonomy level..."
                    value={jobVision.how}
                    onChange={(e) => updateVision('how', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Why am I doing it?
                  </label>
                  <textarea
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows="2"
                    placeholder="Purpose, impact, what drives you..."
                    value={jobVision.why}
                    onChange={(e) => updateVision('why', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next Steps */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold text-indigo-800 mb-3">
          Next Steps for Dream Job Discovery
        </h3>
        <div className="space-y-2 text-indigo-700">
          <div className="flex items-start">
            <ArrowRight className="mr-2 mt-0.5 flex-shrink-0" size={18} />
            <p>Research specific roles that align with your identified themes</p>
          </div>
          <div className="flex items-start">
            <ArrowRight className="mr-2 mt-0.5 flex-shrink-0" size={18} />
            <p>Talk to people in fields that interest you (informational interviews)</p>
          </div>
          <div className="flex items-start">
            <ArrowRight className="mr-2 mt-0.5 flex-shrink-0" size={18} />
            <p>Try small projects or volunteering in areas of interest</p>
          </div>
          <div className="flex items-start">
            <ArrowRight className="mr-2 mt-0.5 flex-shrink-0" size={18} />
            <p>Consider job shadowing or short-term experiences</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DreamJobDiscoveryStep;
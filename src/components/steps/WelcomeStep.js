import React from 'react';
import { Heart, Brain, Target } from 'lucide-react';

const WelcomeStep = () => (
  <div className="text-center py-12">
    <Heart className="mx-auto mb-6 text-teal-600" size={64} />
    <h1 className="text-3xl font-bold text-gray-800 mb-4">
      Welcome to Your Career Development Journey
    </h1>
    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
      This comprehensive self-assessment tool will guide you through various exercises to help you 
      understand your career satisfaction, identify your values and strengths, and create a clear 
      vision for your professional future.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mt-12">
      <div className="bg-blue-50 p-6 rounded-lg">
        <Brain className="text-blue-600 mb-3" size={32} />
        <h3 className="font-semibold text-gray-800 mb-2">Self-Discovery</h3>
        <p className="text-gray-600">Uncover your core values, strengths, and what truly matters to you.</p>
      </div>
      <div className="bg-teal-50 p-6 rounded-lg">
        <Target className="text-teal-600 mb-3" size={32} />
        <h3 className="font-semibold text-gray-800 mb-2">Clear Direction</h3>
        <p className="text-gray-600">Define your ideal work environment and career path.</p>
      </div>
    </div>
  </div>
);

export default WelcomeStep;
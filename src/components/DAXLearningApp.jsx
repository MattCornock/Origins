import React, { useState } from 'react';
import { Book, Code, Trophy, Lightbulb, Search, ChevronRight, Play, Copy, Check } from 'lucide-react';
import DAXFunctionReference from './DAXFunctionReference';
import DAXCodePlayground from './DAXCodePlayground';
import DAXChallenges from './DAXChallenges';
import DAXExamples from './DAXExamples';

const DAXLearningApp = () => {
  const [activeTab, setActiveTab] = useState('reference');
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = [
    { id: 'reference', label: 'Function Reference', icon: Book },
    { id: 'playground', label: 'Code Playground', icon: Code },
    { id: 'examples', label: 'Examples', icon: Lightbulb },
    { id: 'challenges', label: 'Challenges', icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">DAX Mastery</h1>
              <p className="mt-1 text-sm text-gray-600">
                Fast-track your Data Analysis Expressions learning
              </p>
            </div>
            <div className="flex items-center space-x-2 bg-indigo-100 px-4 py-2 rounded-lg">
              <Code className="w-5 h-5 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-900">DAX Learning Platform</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'reference' && (
          <DAXFunctionReference searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        )}
        {activeTab === 'playground' && <DAXCodePlayground />}
        {activeTab === 'examples' && <DAXExamples />}
        {activeTab === 'challenges' && <DAXChallenges />}
      </main>
    </div>
  );
};

export default DAXLearningApp;

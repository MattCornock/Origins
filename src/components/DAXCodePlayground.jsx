import React, { useState } from 'react';
import { Play, RotateCcw, BookOpen, Lightbulb, AlertCircle } from 'lucide-react';

const sampleTemplates = [
  {
    name: 'Basic SUM',
    code: 'Total Sales = SUM(Sales[Amount])',
    description: 'Simple aggregation'
  },
  {
    name: 'CALCULATE with Filter',
    code: 'Sales 2023 = \nCALCULATE(\n  SUM(Sales[Amount]),\n  Year[Year] = 2023\n)',
    description: 'Filtered calculation'
  },
  {
    name: 'SUMX Row-by-Row',
    code: 'Total Revenue = \nSUMX(\n  Sales,\n  Sales[Quantity] * Sales[Price]\n)',
    description: 'Iterator function'
  },
  {
    name: 'Year-over-Year Growth',
    code: 'YoY Growth % = \nVAR CurrentYear = SUM(Sales[Amount])\nVAR PriorYear = \n  CALCULATE(\n    SUM(Sales[Amount]),\n    SAMEPERIODLASTYEAR(Dates[Date])\n  )\nRETURN\n  DIVIDE(CurrentYear - PriorYear, PriorYear)',
    description: 'Time intelligence with variables'
  },
  {
    name: 'Running Total',
    code: 'Running Total = \nCALCULATE(\n  SUM(Sales[Amount]),\n  FILTER(\n    ALL(Dates[Date]),\n    Dates[Date] <= MAX(Dates[Date])\n  )\n)',
    description: 'Cumulative calculation'
  },
  {
    name: 'Conditional Logic',
    code: 'Customer Segment = \nSWITCH(\n  TRUE(),\n  Sales[Amount] > 10000, "Premium",\n  Sales[Amount] > 5000, "Gold",\n  Sales[Amount] > 1000, "Silver",\n  "Bronze"\n)',
    description: 'Multiple conditions'
  }
];

const daxTips = [
  'Use CALCULATE to change filter context - it\'s the most powerful DAX function',
  'Variables (VAR) improve performance and code readability',
  'SUMX and other X functions iterate row-by-row before aggregating',
  'ALL removes filters, ALLEXCEPT keeps some filters',
  'DIVIDE handles division by zero automatically',
  'Use RELATED for many-to-one, RELATEDTABLE for one-to-many',
  'Mark your date table as a date table for time intelligence',
  'EARLIER is used in nested row contexts (rarely needed)',
  'BLANK() is different from 0 - handle it explicitly',
  'Filter context flows downstream in relationships'
];

const commonPatterns = [
  {
    pattern: 'Year-to-Date',
    explanation: 'Use TOTALYTD or DATESYTD for year-to-date calculations',
    code: 'YTD Sales = TOTALYTD(SUM(Sales[Amount]), Dates[Date])'
  },
  {
    pattern: 'Ranking',
    explanation: 'Use RANKX to rank values',
    code: 'Product Rank = RANKX(ALL(Products), SUM(Sales[Amount]))'
  },
  {
    pattern: 'Percentage of Total',
    explanation: 'Divide by total with ALL to remove filters',
    code: '% of Total = DIVIDE(SUM(Sales[Amount]), CALCULATE(SUM(Sales[Amount]), ALL(Sales)))'
  },
  {
    pattern: 'Moving Average',
    explanation: 'Calculate average over a rolling window',
    code: '3-Month MA = \nCALCULATE(\n  AVERAGE(Sales[Amount]),\n  DATESINPERIOD(Dates[Date], MAX(Dates[Date]), -3, MONTH)\n)'
  }
];

const DAXCodePlayground = () => {
  const [code, setCode] = useState('Total Sales = SUM(Sales[Amount])');
  const [activeTemplate, setActiveTemplate] = useState(0);
  const [showTips, setShowTips] = useState(true);
  const [currentTip, setCurrentTip] = useState(0);

  const loadTemplate = (template) => {
    setCode(template.code);
  };

  const resetCode = () => {
    setCode('');
  };

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % daxTips.length);
  };

  const analyzeCode = () => {
    const analysis = {
      hasCalculate: code.includes('CALCULATE'),
      hasVariables: code.includes('VAR'),
      hasIterator: /SUMX|AVERAGEX|COUNTX|MAXX|MINX/i.test(code),
      hasTimeIntelligence: /TOTALYTD|SAMEPERIODLASTYEAR|DATEADD|PARALLELPERIOD/i.test(code),
      hasFilter: code.includes('FILTER'),
      lineCount: code.split('\n').length
    };

    return analysis;
  };

  const analysis = analyzeCode();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Editor */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">DAX Code Editor</h2>
            <div className="flex space-x-2">
              <button
                onClick={resetCode}
                className="flex items-center space-x-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Clear</span>
              </button>
              <button
                className="flex items-center space-x-1 px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Play className="w-4 h-4" />
                <span>Validate</span>
              </button>
            </div>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-64 p-4 font-mono text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
            placeholder="Enter your DAX code here..."
            spellCheck={false}
          />

          {/* Code Analysis */}
          <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
            <h3 className="text-sm font-semibold text-indigo-900 mb-2 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              Code Analysis
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <div className={`text-xs px-2 py-1 rounded ${analysis.hasCalculate ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                {analysis.hasCalculate ? '✓' : '○'} CALCULATE
              </div>
              <div className={`text-xs px-2 py-1 rounded ${analysis.hasVariables ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                {analysis.hasVariables ? '✓' : '○'} Variables
              </div>
              <div className={`text-xs px-2 py-1 rounded ${analysis.hasIterator ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                {analysis.hasIterator ? '✓' : '○'} Iterator
              </div>
              <div className={`text-xs px-2 py-1 rounded ${analysis.hasTimeIntelligence ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                {analysis.hasTimeIntelligence ? '✓' : '○'} Time Intel
              </div>
              <div className={`text-xs px-2 py-1 rounded ${analysis.hasFilter ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                {analysis.hasFilter ? '✓' : '○'} FILTER
              </div>
              <div className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                {analysis.lineCount} lines
              </div>
            </div>
          </div>
        </div>

        {/* Common Patterns */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-indigo-600" />
            Common DAX Patterns
          </h2>
          <div className="space-y-3">
            {commonPatterns.map((pattern, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3 hover:border-indigo-300 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{pattern.pattern}</h3>
                  <button
                    onClick={() => setCode(pattern.code)}
                    className="text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    Use
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-2">{pattern.explanation}</p>
                <code className="text-xs bg-gray-50 text-gray-800 px-2 py-1 rounded block">
                  {pattern.code}
                </code>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        {/* Templates */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Code Templates</h2>
          <div className="space-y-2">
            {sampleTemplates.map((template, index) => (
              <button
                key={index}
                onClick={() => loadTemplate(template)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  activeTemplate === index
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                }`}
              >
                <div className="font-semibold text-sm text-gray-900">{template.name}</div>
                <div className="text-xs text-gray-600 mt-1">{template.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* DAX Tips */}
        {showTips && (
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg shadow-md border border-yellow-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
                DAX Tip
              </h2>
              <button
                onClick={nextTip}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Next →
              </button>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {daxTips[currentTip]}
            </p>
            <div className="mt-3 flex justify-center space-x-1">
              {daxTips.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full ${
                    index === currentTip ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Quick Reference */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Reference</h2>
          <div className="space-y-3 text-sm">
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">Context Transition</h3>
              <p className="text-gray-600 text-xs">CALCULATE changes row context to filter context</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">Iterator vs Aggregator</h3>
              <p className="text-gray-600 text-xs">X functions iterate (SUMX), others aggregate (SUM)</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">Filter Removal</h3>
              <p className="text-gray-600 text-xs">ALL removes all, ALLEXCEPT keeps some</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">Best Practice</h3>
              <p className="text-gray-600 text-xs">Use VAR to store intermediate calculations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DAXCodePlayground;

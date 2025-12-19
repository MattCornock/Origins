import React, { useState } from 'react';
import { Trophy, CheckCircle, XCircle, Lightbulb, Award, Target } from 'lucide-react';

const challenges = [
  {
    id: 1,
    level: 'Beginner',
    title: 'Calculate Total Revenue',
    points: 10,
    description: 'Create a measure that calculates the total revenue by summing all sales amounts.',
    task: 'Write a DAX measure called "Total Revenue" that sums the Amount column from the Sales table.',
    hint: 'Use the SUM function with the Sales[Amount] column.',
    solution: 'Total Revenue = SUM(Sales[Amount])',
    dataContext: 'Sales table with columns: OrderID, CustomerID, ProductID, Amount, Quantity',
    learningObjectives: ['Basic aggregation', 'SUM function', 'Measure syntax']
  },
  {
    id: 2,
    level: 'Beginner',
    title: 'Count Unique Customers',
    points: 10,
    description: 'Count how many distinct customers have made purchases.',
    task: 'Create a measure that counts unique customer IDs.',
    hint: 'Use DISTINCTCOUNT to count unique values.',
    solution: 'Unique Customers = DISTINCTCOUNT(Sales[CustomerID])',
    dataContext: 'Sales table with CustomerID column',
    learningObjectives: ['Distinct counting', 'DISTINCTCOUNT function']
  },
  {
    id: 3,
    level: 'Beginner',
    title: 'Average Order Value',
    points: 15,
    description: 'Calculate the average value per order.',
    task: 'Create a measure that divides total sales by number of orders.',
    hint: 'Use DIVIDE with SUM and DISTINCTCOUNT to safely handle division.',
    solution: 'Avg Order Value = DIVIDE(SUM(Sales[Amount]), DISTINCTCOUNT(Sales[OrderID]))',
    dataContext: 'Sales table with Amount and OrderID columns',
    learningObjectives: ['DIVIDE function', 'Safe division', 'Combining aggregations']
  },
  {
    id: 4,
    level: 'Intermediate',
    title: 'Calculate Net Sales',
    points: 20,
    description: 'Calculate net sales after applying discounts at the row level.',
    task: 'Create a measure using SUMX to calculate: Quantity × Price × (1 - Discount) for each row.',
    hint: 'SUMX iterates row-by-row. Apply the formula to each row before summing.',
    solution: 'Net Sales = SUMX(Sales, Sales[Quantity] * Sales[Price] * (1 - Sales[Discount]))',
    dataContext: 'Sales table with Quantity, Price, and Discount columns',
    learningObjectives: ['Iterator functions', 'SUMX', 'Row context calculations']
  },
  {
    id: 5,
    level: 'Intermediate',
    title: 'Filter by Year',
    points: 20,
    description: 'Calculate sales for a specific year using context modification.',
    task: 'Create a measure that shows sales only for the year 2023.',
    hint: 'Use CALCULATE to modify the filter context with a year condition.',
    solution: 'Sales 2023 = CALCULATE(SUM(Sales[Amount]), Dates[Year] = 2023)',
    dataContext: 'Sales table with Amount, Dates table with Year column',
    learningObjectives: ['CALCULATE function', 'Filter context', 'Context modification']
  },
  {
    id: 6,
    level: 'Intermediate',
    title: 'Prior Year Sales',
    points: 25,
    description: 'Calculate sales from the same period last year.',
    task: 'Create a measure using time intelligence to get last year\'s sales.',
    hint: 'Use CALCULATE with SAMEPERIODLASTYEAR to shift the date context.',
    solution: 'Sales LY = CALCULATE(SUM(Sales[Amount]), SAMEPERIODLASTYEAR(Dates[Date]))',
    dataContext: 'Sales table, Dates table marked as date table',
    learningObjectives: ['Time intelligence', 'SAMEPERIODLASTYEAR', 'Date context']
  },
  {
    id: 7,
    level: 'Intermediate',
    title: 'Percentage of Total',
    points: 25,
    description: 'Calculate what percentage each product represents of total sales.',
    task: 'Create a measure that divides product sales by all sales (ignoring product filter).',
    hint: 'Use ALL to remove the product filter in the denominator.',
    solution: 'Sales % = DIVIDE(SUM(Sales[Amount]), CALCULATE(SUM(Sales[Amount]), ALL(Products)))',
    dataContext: 'Sales and Products tables with relationship',
    learningObjectives: ['ALL function', 'Filter removal', 'Percentage calculations']
  },
  {
    id: 8,
    level: 'Advanced',
    title: 'Year-over-Year Growth',
    points: 30,
    description: 'Calculate the percentage growth compared to last year using variables.',
    task: 'Create a measure with VAR to store current and prior year, then calculate growth %.',
    hint: 'Use VAR for current year sales and prior year sales, then RETURN the growth percentage.',
    solution: 'YoY Growth % = \nVAR CurrentYear = SUM(Sales[Amount])\nVAR PriorYear = CALCULATE(SUM(Sales[Amount]), SAMEPERIODLASTYEAR(Dates[Date]))\nRETURN DIVIDE(CurrentYear - PriorYear, PriorYear)',
    dataContext: 'Sales and Dates tables',
    learningObjectives: ['Variables (VAR)', 'Multi-step calculations', 'Growth metrics']
  },
  {
    id: 9,
    level: 'Advanced',
    title: 'Running Total',
    points: 35,
    description: 'Calculate cumulative sales from the beginning up to the current date.',
    task: 'Create a measure that accumulates sales up to the current date in context.',
    hint: 'Use FILTER with ALL to include all dates up to MAX(Dates[Date]).',
    solution: 'Running Total = CALCULATE(SUM(Sales[Amount]), FILTER(ALL(Dates[Date]), Dates[Date] <= MAX(Dates[Date])))',
    dataContext: 'Sales and Dates tables',
    learningObjectives: ['FILTER function', 'ALL function', 'Cumulative calculations']
  },
  {
    id: 10,
    level: 'Advanced',
    title: 'Top 10 Products Sales',
    points: 40,
    description: 'Calculate sales only for the top 10 products by revenue.',
    task: 'Create a measure that shows sales only for products ranked in top 10.',
    hint: 'Use CALCULATE with FILTER and RANKX to limit to top 10 products.',
    solution: 'Top 10 Sales = CALCULATE(SUM(Sales[Amount]), FILTER(ALL(Products), RANKX(ALL(Products), [Total Sales]) <= 10))',
    dataContext: 'Sales and Products tables, assume [Total Sales] measure exists',
    learningObjectives: ['RANKX function', 'Complex filtering', 'Dynamic segmentation']
  },
  {
    id: 11,
    level: 'Advanced',
    title: 'Sales Per Customer Segment',
    points: 35,
    description: 'Calculate sales while keeping category filter but removing product filter.',
    task: 'Create a measure showing sales total by category regardless of specific products selected.',
    hint: 'Use ALLEXCEPT to remove all filters except the category.',
    solution: 'Category Total = CALCULATE(SUM(Sales[Amount]), ALLEXCEPT(Products, Products[Category]))',
    dataContext: 'Sales and Products tables with Category column',
    learningObjectives: ['ALLEXCEPT function', 'Selective filter removal', 'Context control']
  },
  {
    id: 12,
    level: 'Expert',
    title: 'Customer Retention Rate',
    points: 50,
    description: 'Calculate what percentage of last year\'s customers made purchases this year.',
    task: 'Create a complex measure comparing customer sets across years.',
    hint: 'Use CALCULATE with date filters to get distinct customers for each year, then divide.',
    solution: 'Retention Rate = \nVAR CustomersLY = CALCULATE(DISTINCTCOUNT(Sales[CustomerID]), SAMEPERIODLASTYEAR(Dates[Date]))\nVAR ReturningCustomers = CALCULATE(DISTINCTCOUNT(Sales[CustomerID]), FILTER(ALL(Dates), Dates[Date] <= MAX(Dates[Date]) && CALCULATE(COUNTROWS(Sales), SAMEPERIODLASTYEAR(Dates[Date])) > 0))\nRETURN DIVIDE(ReturningCustomers, CustomersLY)',
    dataContext: 'Sales and Dates tables',
    learningObjectives: ['Advanced VAR usage', 'Complex filtering', 'Set comparisons']
  }
];

const ChallengeCard = ({ challenge, onAttempt, isCompleted }) => {
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const levelColors = {
    'Beginner': 'bg-green-100 text-green-800 border-green-300',
    'Intermediate': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'Advanced': 'bg-orange-100 text-orange-800 border-orange-300',
    'Expert': 'bg-red-100 text-red-800 border-red-300'
  };

  return (
    <div className={`bg-white rounded-lg shadow-md border-2 p-6 ${isCompleted ? 'border-green-400' : 'border-gray-200'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-bold text-gray-900">{challenge.title}</h3>
            {isCompleted && <CheckCircle className="w-5 h-5 text-green-600" />}
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-xs px-2 py-1 rounded border font-medium ${levelColors[challenge.level]}`}>
              {challenge.level}
            </span>
            <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded border border-indigo-300 font-medium flex items-center">
              <Trophy className="w-3 h-3 mr-1" />
              {challenge.points} pts
            </span>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-700 mb-3">{challenge.description}</p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
        <p className="text-sm font-semibold text-blue-900 mb-1">Task:</p>
        <p className="text-sm text-blue-800">{challenge.task}</p>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3">
        <p className="text-xs font-semibold text-gray-700 mb-1">Data Context:</p>
        <p className="text-xs text-gray-600">{challenge.dataContext}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {challenge.learningObjectives.map((objective, index) => (
          <span key={index} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
            {objective}
          </span>
        ))}
      </div>

      <div className="space-y-2">
        <button
          onClick={() => setShowHint(!showHint)}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors border border-yellow-300"
        >
          <Lightbulb className="w-4 h-4" />
          <span className="text-sm font-medium">{showHint ? 'Hide Hint' : 'Show Hint'}</span>
        </button>

        {showHint && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-900">{challenge.hint}</p>
          </div>
        )}

        <button
          onClick={() => setShowSolution(!showSolution)}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
        >
          <Target className="w-4 h-4" />
          <span className="text-sm font-medium">{showSolution ? 'Hide Solution' : 'Show Solution'}</span>
        </button>

        {showSolution && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-xs font-semibold text-green-900 mb-1">Solution:</p>
            <pre className="text-sm text-green-800 font-mono overflow-x-auto">
              {challenge.solution}
            </pre>
          </div>
        )}

        {!isCompleted && (
          <button
            onClick={() => onAttempt(challenge.id)}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Mark as Completed</span>
          </button>
        )}
      </div>
    </div>
  );
};

const DAXChallenges = () => {
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('All');

  const handleAttempt = (challengeId) => {
    if (!completedChallenges.includes(challengeId)) {
      setCompletedChallenges([...completedChallenges, challengeId]);
    }
  };

  const filteredChallenges = selectedLevel === 'All'
    ? challenges
    : challenges.filter(c => c.level === selectedLevel);

  const totalPoints = challenges.reduce((sum, c) => sum + c.points, 0);
  const earnedPoints = challenges
    .filter(c => completedChallenges.includes(c.id))
    .reduce((sum, c) => sum + c.points, 0);

  const progressPercentage = (earnedPoints / totalPoints) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">DAX Challenges</h1>
            <p className="text-indigo-100">Test your skills and track your progress</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg px-6 py-3 text-center">
            <div className="text-3xl font-bold">{earnedPoints}</div>
            <div className="text-sm text-indigo-100">of {totalPoints} points</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white bg-opacity-20 rounded-full h-4 overflow-hidden">
          <div
            className="bg-white h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2 text-sm text-indigo-100">
          <span>{completedChallenges.length} of {challenges.length} challenges completed</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Challenges</p>
              <p className="text-2xl font-bold text-gray-900">{challenges.length}</p>
            </div>
            <Target className="w-8 h-8 text-indigo-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{completedChallenges.length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Remaining</p>
              <p className="text-2xl font-bold text-orange-600">{challenges.length - completedChallenges.length}</p>
            </div>
            <XCircle className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Points Earned</p>
              <p className="text-2xl font-bold text-purple-600">{earnedPoints}</p>
            </div>
            <Award className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'].map((level) => (
          <button
            key={level}
            onClick={() => setSelectedLevel(level)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedLevel === level
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {level}
            {level !== 'All' && (
              <span className="ml-2 text-xs opacity-75">
                ({challenges.filter(c => c.level === level).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredChallenges.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            onAttempt={handleAttempt}
            isCompleted={completedChallenges.includes(challenge.id)}
          />
        ))}
      </div>

      {filteredChallenges.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md border border-gray-200">
          <p className="text-gray-500">No challenges found for this level.</p>
        </div>
      )}
    </div>
  );
};

export default DAXChallenges;

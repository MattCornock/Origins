import React, { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronRight, BookOpen } from 'lucide-react';

const daxExamples = [
  {
    category: 'Sales Analysis',
    examples: [
      {
        title: 'Total Sales',
        difficulty: 'Beginner',
        description: 'Calculate the total sales amount across all transactions.',
        code: 'Total Sales = SUM(Sales[Amount])',
        explanation: 'The SUM function aggregates all values in the Amount column of the Sales table.',
        useCases: ['Basic reporting', 'KPI dashboards', 'Summary tables']
      },
      {
        title: 'Sales by Product',
        difficulty: 'Beginner',
        description: 'Get the product name for each sale using a relationship.',
        code: 'Product Name = RELATED(Products[ProductName])',
        explanation: 'RELATED follows the many-to-one relationship from Sales to Products to retrieve the product name.',
        useCases: ['Sales reports', 'Detailed transaction views', 'Product analysis']
      },
      {
        title: 'Sales with Discount',
        difficulty: 'Intermediate',
        description: 'Calculate net sales after applying discounts row by row.',
        code: 'Net Sales = \nSUMX(\n  Sales,\n  Sales[Quantity] * Sales[Price] * (1 - Sales[Discount])\n)',
        explanation: 'SUMX iterates through each row, calculates the net amount considering discount, then sums the results.',
        useCases: ['Revenue calculation', 'Margin analysis', 'Discount impact analysis']
      },
      {
        title: 'Sales Last Year',
        difficulty: 'Intermediate',
        description: 'Calculate sales for the same period in the previous year.',
        code: 'Sales LY = \nCALCULATE(\n  SUM(Sales[Amount]),\n  SAMEPERIODLASTYEAR(Dates[Date])\n)',
        explanation: 'CALCULATE evaluates SUM with a modified date context using SAMEPERIODLASTYEAR for year-over-year comparisons.',
        useCases: ['YoY comparisons', 'Trend analysis', 'Performance reporting']
      },
      {
        title: 'Year-over-Year Growth',
        difficulty: 'Advanced',
        description: 'Calculate the percentage growth compared to last year.',
        code: 'YoY Growth % = \nVAR CurrentYear = SUM(Sales[Amount])\nVAR PriorYear = \n  CALCULATE(\n    SUM(Sales[Amount]),\n    SAMEPERIODLASTYEAR(Dates[Date])\n  )\nRETURN\n  DIVIDE(CurrentYear - PriorYear, PriorYear, 0)',
        explanation: 'Uses variables to store current and prior year sales, then calculates the growth percentage safely handling division by zero.',
        useCases: ['Growth metrics', 'Executive dashboards', 'Trend analysis']
      }
    ]
  },
  {
    category: 'Time Intelligence',
    examples: [
      {
        title: 'Year-to-Date Sales',
        difficulty: 'Intermediate',
        description: 'Calculate cumulative sales from the start of the year to the current date.',
        code: 'YTD Sales = \nTOTALYTD(\n  SUM(Sales[Amount]),\n  Dates[Date]\n)',
        explanation: 'TOTALYTD accumulates values from January 1st to the current date in the filter context.',
        useCases: ['Performance tracking', 'Budget vs actual', 'Cumulative metrics']
      },
      {
        title: 'Quarter-to-Date Sales',
        difficulty: 'Intermediate',
        description: 'Calculate cumulative sales from the start of the quarter.',
        code: 'QTD Sales = \nTOTALQTD(\n  SUM(Sales[Amount]),\n  Dates[Date]\n)',
        explanation: 'TOTALQTD accumulates values from the start of the quarter to the current date.',
        useCases: ['Quarterly reporting', 'Progress tracking', 'Period comparisons']
      },
      {
        title: 'Moving Average (3 Months)',
        difficulty: 'Advanced',
        description: 'Calculate a 3-month rolling average of sales.',
        code: '3M Moving Avg = \nCALCULATE(\n  AVERAGE(Sales[Amount]),\n  DATESINPERIOD(\n    Dates[Date],\n    MAX(Dates[Date]),\n    -3,\n    MONTH\n  )\n)',
        explanation: 'DATESINPERIOD creates a rolling 3-month window, and AVERAGE calculates the mean within that period.',
        useCases: ['Trend smoothing', 'Seasonality analysis', 'Forecasting support']
      },
      {
        title: 'Previous Month Sales',
        difficulty: 'Intermediate',
        description: 'Get sales from the previous month.',
        code: 'Previous Month = \nCALCULATE(\n  SUM(Sales[Amount]),\n  DATEADD(Dates[Date], -1, MONTH)\n)',
        explanation: 'DATEADD shifts the date context back by one month to retrieve previous month sales.',
        useCases: ['Month-over-month comparisons', 'Sequential analysis', 'Change tracking']
      },
      {
        title: 'Custom Fiscal Year',
        difficulty: 'Advanced',
        description: 'Calculate year-to-date for a fiscal year ending in June.',
        code: 'Fiscal YTD = \nTOTALYTD(\n  SUM(Sales[Amount]),\n  Dates[Date],\n  "6/30"\n)',
        explanation: 'The third parameter in TOTALYTD specifies the fiscal year end date.',
        useCases: ['Fiscal year reporting', 'Non-calendar year businesses', 'Custom periods']
      }
    ]
  },
  {
    category: 'Filtering & Context',
    examples: [
      {
        title: 'Sales for Specific Year',
        difficulty: 'Beginner',
        description: 'Calculate sales only for the year 2023.',
        code: 'Sales 2023 = \nCALCULATE(\n  SUM(Sales[Amount]),\n  Dates[Year] = 2023\n)',
        explanation: 'CALCULATE modifies the filter context to include only rows where Year equals 2023.',
        useCases: ['Period-specific metrics', 'Historical comparisons', 'Filtered KPIs']
      },
      {
        title: 'High-Value Customers',
        difficulty: 'Intermediate',
        description: 'Count customers with lifetime value over $10,000.',
        code: 'High Value Customers = \nCOUNTROWS(\n  FILTER(\n    VALUES(Customers[CustomerID]),\n    [Total Sales] > 10000\n  )\n)',
        explanation: 'FILTER creates a table of customers where their total sales exceed $10,000, then COUNTROWS counts them.',
        useCases: ['Customer segmentation', 'VIP identification', 'Targeted marketing']
      },
      {
        title: 'Sales Ignoring Product Filter',
        difficulty: 'Intermediate',
        description: 'Calculate total sales regardless of product filter applied.',
        code: 'All Products Sales = \nCALCULATE(\n  SUM(Sales[Amount]),\n  ALL(Products)\n)',
        explanation: 'ALL removes any filters on the Products table, showing total sales across all products.',
        useCases: ['Percentage of total', 'Comparative analysis', 'Unfiltered baselines']
      },
      {
        title: 'Sales % of Category',
        difficulty: 'Advanced',
        description: 'Calculate each product\'s percentage of its category total.',
        code: 'Category % = \nVAR ProductSales = SUM(Sales[Amount])\nVAR CategorySales = \n  CALCULATE(\n    SUM(Sales[Amount]),\n    ALLEXCEPT(Products, Products[Category])\n  )\nRETURN\n  DIVIDE(ProductSales, CategorySales)',
        explanation: 'ALLEXCEPT removes all product filters except Category, enabling percentage calculation within each category.',
        useCases: ['Market share analysis', 'Category performance', 'Relative comparisons']
      },
      {
        title: 'Running Total',
        difficulty: 'Advanced',
        description: 'Calculate cumulative sales up to the current date.',
        code: 'Running Total = \nCALCULATE(\n  SUM(Sales[Amount]),\n  FILTER(\n    ALL(Dates[Date]),\n    Dates[Date] <= MAX(Dates[Date])\n  )\n)',
        explanation: 'FILTER with ALL creates a dynamic date range from the earliest date up to the current context date.',
        useCases: ['Cumulative metrics', 'Progress tracking', 'Achievement monitoring']
      }
    ]
  },
  {
    category: 'Customer Analytics',
    examples: [
      {
        title: 'Customer Count',
        difficulty: 'Beginner',
        description: 'Count the number of unique customers.',
        code: 'Customer Count = DISTINCTCOUNT(Sales[CustomerID])',
        explanation: 'DISTINCTCOUNT returns the number of unique customer IDs in the Sales table.',
        useCases: ['Customer base tracking', 'Growth metrics', 'Retention analysis']
      },
      {
        title: 'Average Order Value',
        difficulty: 'Intermediate',
        description: 'Calculate the average value per order.',
        code: 'Avg Order Value = \nDIVIDE(\n  SUM(Sales[Amount]),\n  DISTINCTCOUNT(Sales[OrderID])\n)',
        explanation: 'Divides total sales by the number of unique orders to get average value per order.',
        useCases: ['Sales metrics', 'Customer behavior', 'Revenue optimization']
      },
      {
        title: 'Customer Lifetime Value',
        difficulty: 'Intermediate',
        description: 'Calculate total value of purchases per customer.',
        code: 'Customer LTV = \nSUMX(\n  VALUES(Customers[CustomerID]),\n  CALCULATE(SUM(Sales[Amount]))\n)',
        explanation: 'Iterates through unique customers and calculates total sales for each.',
        useCases: ['Customer valuation', 'Segmentation', 'Marketing ROI']
      },
      {
        title: 'New vs Returning Customers',
        difficulty: 'Advanced',
        description: 'Identify if a customer is new or returning in the current period.',
        code: 'Customer Type = \nVAR FirstPurchaseDate = \n  CALCULATE(\n    MIN(Sales[OrderDate]),\n    ALL(Dates)\n  )\nVAR CurrentPeriodStart = MIN(Dates[Date])\nRETURN\n  IF(FirstPurchaseDate >= CurrentPeriodStart, "New", "Returning")',
        explanation: 'Compares the customer\'s first purchase date with the current period to classify them.',
        useCases: ['Customer acquisition', 'Retention metrics', 'Cohort analysis']
      },
      {
        title: 'Average Customer Orders',
        difficulty: 'Intermediate',
        description: 'Calculate average number of orders per customer.',
        code: 'Avg Orders Per Customer = \nDIVIDE(\n  DISTINCTCOUNT(Sales[OrderID]),\n  DISTINCTCOUNT(Sales[CustomerID])\n)',
        explanation: 'Divides total unique orders by unique customers to get average orders per customer.',
        useCases: ['Customer engagement', 'Loyalty metrics', 'Behavior analysis']
      }
    ]
  },
  {
    category: 'Product Analytics',
    examples: [
      {
        title: 'Product Ranking',
        difficulty: 'Intermediate',
        description: 'Rank products by total sales.',
        code: 'Product Rank = \nRANKX(\n  ALL(Products[ProductName]),\n  [Total Sales],\n  ,\n  DESC\n)',
        explanation: 'RANKX ranks all products by their total sales in descending order.',
        useCases: ['Top performers', 'Product comparison', 'Inventory prioritization']
      },
      {
        title: 'Product Sales Contribution',
        difficulty: 'Intermediate',
        description: 'Calculate each product\'s percentage of total sales.',
        code: 'Sales % = \nDIVIDE(\n  SUM(Sales[Amount]),\n  CALCULATE(\n    SUM(Sales[Amount]),\n    ALL(Products)\n  )\n)',
        explanation: 'Divides product sales by total sales across all products.',
        useCases: ['Revenue contribution', 'Portfolio analysis', 'ABC classification']
      },
      {
        title: 'Products Sold',
        difficulty: 'Beginner',
        description: 'Count number of unique products sold.',
        code: 'Products Sold = DISTINCTCOUNT(Sales[ProductID])',
        explanation: 'Counts the number of distinct product IDs in sales transactions.',
        useCases: ['Assortment metrics', 'Sales coverage', 'Product performance']
      },
      {
        title: 'Average Price by Category',
        difficulty: 'Intermediate',
        description: 'Calculate the average product price within each category.',
        code: 'Avg Category Price = \nAVERAGEX(\n  VALUES(Products[ProductID]),\n  Products[Price]\n)',
        explanation: 'AVERAGEX iterates through unique products and averages their prices.',
        useCases: ['Pricing strategy', 'Category analysis', 'Competitive positioning']
      },
      {
        title: 'Stock-to-Sales Ratio',
        difficulty: 'Advanced',
        description: 'Calculate how long current inventory will last based on sales rate.',
        code: 'Months of Stock = \nVAR AvgMonthlySales = \n  CALCULATE(\n    AVERAGE(Sales[Quantity]),\n    DATESINPERIOD(Dates[Date], MAX(Dates[Date]), -6, MONTH)\n  )\nRETURN\n  DIVIDE(SUM(Inventory[Quantity]), AvgMonthlySales)',
        explanation: 'Divides current inventory by average monthly sales from the last 6 months.',
        useCases: ['Inventory management', 'Supply chain', 'Purchasing decisions']
      }
    ]
  }
];

const ExampleCard = ({ example }) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(example.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const difficultyColors = {
    'Beginner': 'bg-green-100 text-green-800',
    'Intermediate': 'bg-yellow-100 text-yellow-800',
    'Advanced': 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900">{example.title}</h3>
          <span className={`text-xs px-2 py-1 rounded font-medium ${difficultyColors[example.difficulty]}`}>
            {example.difficulty}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-3">{example.description}</p>

        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-700">DAX Code:</span>
            <button
              onClick={copyCode}
              className="text-gray-600 hover:text-gray-900 transition-colors"
              title="Copy code"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <pre className="text-sm text-gray-800 font-mono overflow-x-auto">
            {example.code}
          </pre>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between text-sm text-indigo-600 hover:text-indigo-800 font-medium"
        >
          <span>View explanation & use cases</span>
          {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {expanded && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Explanation:</h4>
              <p className="text-sm text-gray-700 leading-relaxed">{example.explanation}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Use Cases:</h4>
              <ul className="space-y-1">
                {example.useCases.map((useCase, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="text-indigo-600 mr-2">•</span>
                    {useCase}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DAXExamples = () => {
  const [selectedCategory, setSelectedCategory] = useState('Sales Analysis');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const currentCategory = daxExamples.find(cat => cat.category === selectedCategory);

  const filteredExamples = selectedDifficulty === 'All'
    ? currentCategory?.examples || []
    : currentCategory?.examples.filter(ex => ex.difficulty === selectedDifficulty) || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 sticky top-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-indigo-600" />
            Categories
          </h2>

          <div className="space-y-2 mb-6">
            {daxExamples.map((category) => (
              <button
                key={category.category}
                onClick={() => setSelectedCategory(category.category)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.category
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.category}
                <span className="float-right text-xs opacity-75">
                  {category.examples.length}
                </span>
              </button>
            ))}
          </div>

          <h3 className="text-sm font-bold text-gray-900 mb-2">Difficulty</h3>
          <div className="space-y-2">
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map((level) => (
              <button
                key={level}
                onClick={() => setSelectedDifficulty(level)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedDifficulty === level
                    ? 'bg-indigo-100 text-indigo-800 font-medium'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedCategory}</h1>
          <p className="text-gray-600">
            {filteredExamples.length} example{filteredExamples.length !== 1 ? 's' : ''}
            {selectedDifficulty !== 'All' && ` (${selectedDifficulty})`}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredExamples.map((example, index) => (
            <ExampleCard key={index} example={example} />
          ))}
        </div>

        {filteredExamples.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md border border-gray-200">
            <p className="text-gray-500">
              No {selectedDifficulty.toLowerCase()} examples found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DAXExamples;

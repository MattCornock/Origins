import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronRight, Copy, Check } from 'lucide-react';

const daxFunctions = {
  'Aggregation': [
    {
      name: 'SUM',
      syntax: 'SUM(<column>)',
      description: 'Returns the sum of all numbers in a column.',
      example: 'Total Sales = SUM(Sales[Amount])',
      usage: 'Basic aggregation of numeric values'
    },
    {
      name: 'SUMX',
      syntax: 'SUMX(<table>, <expression>)',
      description: 'Returns the sum of an expression evaluated for each row in a table.',
      example: 'Total Revenue = SUMX(Sales, Sales[Quantity] * Sales[Price])',
      usage: 'Row-by-row calculation then sum'
    },
    {
      name: 'AVERAGE',
      syntax: 'AVERAGE(<column>)',
      description: 'Returns the average (arithmetic mean) of all numbers in a column.',
      example: 'Avg Price = AVERAGE(Products[Price])',
      usage: 'Calculate mean values'
    },
    {
      name: 'AVERAGEX',
      syntax: 'AVERAGEX(<table>, <expression>)',
      description: 'Calculates the average of an expression evaluated for each row.',
      example: 'Avg Margin = AVERAGEX(Sales, Sales[Revenue] - Sales[Cost])',
      usage: 'Row-by-row calculation then average'
    },
    {
      name: 'COUNT',
      syntax: 'COUNT(<column>)',
      description: 'Counts the number of cells in a column that contain numbers.',
      example: 'Product Count = COUNT(Products[ProductID])',
      usage: 'Count numeric values'
    },
    {
      name: 'COUNTROWS',
      syntax: 'COUNTROWS(<table>)',
      description: 'Counts the number of rows in a table.',
      example: 'Total Orders = COUNTROWS(Orders)',
      usage: 'Count all rows in a table'
    },
    {
      name: 'DISTINCTCOUNT',
      syntax: 'DISTINCTCOUNT(<column>)',
      description: 'Counts the number of distinct values in a column.',
      example: 'Unique Customers = DISTINCTCOUNT(Sales[CustomerID])',
      usage: 'Count unique values'
    },
    {
      name: 'MIN',
      syntax: 'MIN(<column>)',
      description: 'Returns the smallest numeric value in a column.',
      example: 'Lowest Price = MIN(Products[Price])',
      usage: 'Find minimum value'
    },
    {
      name: 'MAX',
      syntax: 'MAX(<column>)',
      description: 'Returns the largest numeric value in a column.',
      example: 'Highest Price = MAX(Products[Price])',
      usage: 'Find maximum value'
    }
  ],
  'Filter': [
    {
      name: 'FILTER',
      syntax: 'FILTER(<table>, <filter>)',
      description: 'Returns a table that represents a subset of another table.',
      example: 'High Value Sales = FILTER(Sales, Sales[Amount] > 1000)',
      usage: 'Filter rows based on conditions'
    },
    {
      name: 'CALCULATE',
      syntax: 'CALCULATE(<expression>, <filter1>, <filter2>, ...)',
      description: 'Evaluates an expression in a modified filter context.',
      example: 'Sales 2023 = CALCULATE(SUM(Sales[Amount]), Year[Year] = 2023)',
      usage: 'Most powerful DAX function - apply filters to calculations'
    },
    {
      name: 'CALCULATETABLE',
      syntax: 'CALCULATETABLE(<table>, <filter1>, <filter2>, ...)',
      description: 'Evaluates a table expression in a modified filter context.',
      example: 'Filtered Products = CALCULATETABLE(Products, Products[Category] = "Electronics")',
      usage: 'Filter tables with context modification'
    },
    {
      name: 'ALL',
      syntax: 'ALL(<table> or <column>)',
      description: 'Removes all filters from the specified columns or table.',
      example: 'Total All Sales = CALCULATE(SUM(Sales[Amount]), ALL(Sales))',
      usage: 'Remove filters for grand totals'
    },
    {
      name: 'ALLEXCEPT',
      syntax: 'ALLEXCEPT(<table>, <column1>, <column2>, ...)',
      description: 'Removes all context filters except on specified columns.',
      example: 'Sales By Category = CALCULATE(SUM(Sales[Amount]), ALLEXCEPT(Products, Products[Category]))',
      usage: 'Keep some filters, remove others'
    },
    {
      name: 'ALLSELECTED',
      syntax: 'ALLSELECTED([<table> or <column>])',
      description: 'Removes context filters while keeping filters from slicers.',
      example: 'Percent of Visible = DIVIDE(SUM(Sales[Amount]), CALCULATE(SUM(Sales[Amount]), ALLSELECTED()))',
      usage: 'Respect visual-level filters'
    },
    {
      name: 'REMOVEFILTERS',
      syntax: 'REMOVEFILTERS([<table> or <column>])',
      description: 'Clears filters from the specified table or column.',
      example: 'Unfiltered Total = CALCULATE(SUM(Sales[Amount]), REMOVEFILTERS())',
      usage: 'Modern replacement for ALL in filters'
    },
    {
      name: 'VALUES',
      syntax: 'VALUES(<column>)',
      description: 'Returns a one-column table with distinct values from a column.',
      example: 'Unique Categories = VALUES(Products[Category])',
      usage: 'Get distinct values respecting filters'
    },
    {
      name: 'DISTINCT',
      syntax: 'DISTINCT(<column>)',
      description: 'Returns a one-column table with distinct values.',
      example: 'Distinct Customers = DISTINCT(Sales[CustomerID])',
      usage: 'Get distinct values (blank if no match)'
    }
  ],
  'Date & Time': [
    {
      name: 'CALENDAR',
      syntax: 'CALENDAR(<start_date>, <end_date>)',
      description: 'Returns a table with a single column of dates.',
      example: 'DateTable = CALENDAR(DATE(2020,1,1), DATE(2024,12,31))',
      usage: 'Create date dimension table'
    },
    {
      name: 'CALENDARAUTO',
      syntax: 'CALENDARAUTO([<fiscal_year_end_month>])',
      description: 'Automatically creates a date table based on data in the model.',
      example: 'Auto Dates = CALENDARAUTO()',
      usage: 'Auto-generate date table'
    },
    {
      name: 'DATE',
      syntax: 'DATE(<year>, <month>, <day>)',
      description: 'Returns a datetime value from year, month, and day.',
      example: 'Start Date = DATE(2023, 1, 1)',
      usage: 'Create specific dates'
    },
    {
      name: 'YEAR',
      syntax: 'YEAR(<date>)',
      description: 'Returns the year of a date.',
      example: 'Year = YEAR(Sales[OrderDate])',
      usage: 'Extract year from date'
    },
    {
      name: 'MONTH',
      syntax: 'MONTH(<date>)',
      description: 'Returns the month number (1-12) from a date.',
      example: 'Month = MONTH(Sales[OrderDate])',
      usage: 'Extract month number'
    },
    {
      name: 'DAY',
      syntax: 'DAY(<date>)',
      description: 'Returns the day of the month (1-31) from a date.',
      example: 'Day = DAY(Sales[OrderDate])',
      usage: 'Extract day from date'
    },
    {
      name: 'DATEDIFF',
      syntax: 'DATEDIFF(<start_date>, <end_date>, <interval>)',
      description: 'Returns the count of interval boundaries crossed between two dates.',
      example: 'Days Between = DATEDIFF(Sales[OrderDate], Sales[ShipDate], DAY)',
      usage: 'Calculate time difference'
    },
    {
      name: 'DATEADD',
      syntax: 'DATEADD(<dates>, <number_of_intervals>, <interval>)',
      description: 'Returns a table of dates shifted by specified intervals.',
      example: 'Prior Year = CALCULATE(SUM(Sales[Amount]), DATEADD(Dates[Date], -1, YEAR))',
      usage: 'Time intelligence - shift dates'
    },
    {
      name: 'SAMEPERIODLASTYEAR',
      syntax: 'SAMEPERIODLASTYEAR(<dates>)',
      description: 'Returns dates from the same period last year.',
      example: 'Sales LY = CALCULATE(SUM(Sales[Amount]), SAMEPERIODLASTYEAR(Dates[Date]))',
      usage: 'Year-over-year comparisons'
    },
    {
      name: 'TOTALYTD',
      syntax: 'TOTALYTD(<expression>, <dates>, [<filter>], [<year_end_date>])',
      description: 'Evaluates the year-to-date value of an expression.',
      example: 'YTD Sales = TOTALYTD(SUM(Sales[Amount]), Dates[Date])',
      usage: 'Calculate year-to-date values'
    }
  ],
  'Logical': [
    {
      name: 'IF',
      syntax: 'IF(<logical_test>, <value_if_true>, [<value_if_false>])',
      description: 'Checks a condition and returns one value if TRUE, another if FALSE.',
      example: 'Price Category = IF(Products[Price] > 100, "Premium", "Standard")',
      usage: 'Conditional logic'
    },
    {
      name: 'SWITCH',
      syntax: 'SWITCH(<expression>, <value1>, <result1>, ..., [<else>])',
      description: 'Evaluates an expression against a list of values and returns a result.',
      example: 'Season = SWITCH([Month], 12, "Winter", 1, "Winter", 2, "Winter", "Other")',
      usage: 'Multiple condition matching'
    },
    {
      name: 'AND',
      syntax: 'AND(<logical1>, <logical2>)',
      description: 'Returns TRUE if both arguments are TRUE.',
      example: 'High Value New = IF(AND(Sales[Amount] > 1000, Sales[IsNew] = TRUE), "Yes", "No")',
      usage: 'Combine multiple conditions (AND)'
    },
    {
      name: 'OR',
      syntax: 'OR(<logical1>, <logical2>)',
      description: 'Returns TRUE if any argument is TRUE.',
      example: 'Needs Review = OR(Sales[Amount] > 10000, Sales[Status] = "Pending")',
      usage: 'Combine multiple conditions (OR)'
    },
    {
      name: 'NOT',
      syntax: 'NOT(<logical>)',
      description: 'Returns the opposite of a logical value.',
      example: 'Not Active = NOT(Customers[IsActive])',
      usage: 'Negate logical values'
    },
    {
      name: 'ISBLANK',
      syntax: 'ISBLANK(<value>)',
      description: 'Checks whether a value is blank.',
      example: 'Has Notes = IF(ISBLANK(Orders[Notes]), "No", "Yes")',
      usage: 'Check for blank/null values'
    },
    {
      name: 'IFERROR',
      syntax: 'IFERROR(<value>, <value_if_error>)',
      description: 'Returns value_if_error if the first expression is an error.',
      example: 'Safe Margin = IFERROR(DIVIDE(Sales[Profit], Sales[Revenue]), 0)',
      usage: 'Error handling'
    }
  ],
  'Text': [
    {
      name: 'CONCATENATE',
      syntax: 'CONCATENATE(<text1>, <text2>)',
      description: 'Joins two text strings into one.',
      example: 'Full Name = CONCATENATE(Customers[FirstName], " " & Customers[LastName])',
      usage: 'Combine text strings'
    },
    {
      name: 'FORMAT',
      syntax: 'FORMAT(<value>, <format_string>)',
      description: 'Converts a value to text according to a format.',
      example: 'Formatted Date = FORMAT(Orders[OrderDate], "MMM DD, YYYY")',
      usage: 'Format numbers and dates as text'
    },
    {
      name: 'LEFT',
      syntax: 'LEFT(<text>, <num_chars>)',
      description: 'Returns a specified number of characters from the start of a text string.',
      example: 'Country Code = LEFT(Customers[Phone], 2)',
      usage: 'Extract left portion of text'
    },
    {
      name: 'RIGHT',
      syntax: 'RIGHT(<text>, <num_chars>)',
      description: 'Returns a specified number of characters from the end of a text string.',
      example: 'Extension = RIGHT(Customers[Phone], 4)',
      usage: 'Extract right portion of text'
    },
    {
      name: 'LEN',
      syntax: 'LEN(<text>)',
      description: 'Returns the number of characters in a text string.',
      example: 'Name Length = LEN(Products[ProductName])',
      usage: 'Get text length'
    },
    {
      name: 'UPPER',
      syntax: 'UPPER(<text>)',
      description: 'Converts a text string to uppercase.',
      example: 'Category Upper = UPPER(Products[Category])',
      usage: 'Convert to uppercase'
    },
    {
      name: 'LOWER',
      syntax: 'LOWER(<text>)',
      description: 'Converts a text string to lowercase.',
      example: 'Email Lower = LOWER(Customers[Email])',
      usage: 'Convert to lowercase'
    },
    {
      name: 'TRIM',
      syntax: 'TRIM(<text>)',
      description: 'Removes all spaces from text except single spaces between words.',
      example: 'Clean Name = TRIM(Customers[Name])',
      usage: 'Remove extra spaces'
    }
  ],
  'Math': [
    {
      name: 'DIVIDE',
      syntax: 'DIVIDE(<numerator>, <denominator>, [<alternate_result>])',
      description: 'Performs division and handles division by zero.',
      example: 'Profit Margin = DIVIDE(Sales[Profit], Sales[Revenue], 0)',
      usage: 'Safe division (prevents errors)'
    },
    {
      name: 'ROUND',
      syntax: 'ROUND(<number>, <num_digits>)',
      description: 'Rounds a number to the specified number of digits.',
      example: 'Rounded Price = ROUND(Products[Price], 2)',
      usage: 'Round numbers'
    },
    {
      name: 'ROUNDUP',
      syntax: 'ROUNDUP(<number>, <num_digits>)',
      description: 'Rounds a number up, away from zero.',
      example: 'Rounded Up = ROUNDUP(Sales[Amount], 0)',
      usage: 'Always round up'
    },
    {
      name: 'ROUNDDOWN',
      syntax: 'ROUNDDOWN(<number>, <num_digits>)',
      description: 'Rounds a number down, toward zero.',
      example: 'Rounded Down = ROUNDDOWN(Sales[Amount], 0)',
      usage: 'Always round down'
    },
    {
      name: 'ABS',
      syntax: 'ABS(<number>)',
      description: 'Returns the absolute value of a number.',
      example: 'Variance Abs = ABS(Sales[Actual] - Sales[Budget])',
      usage: 'Get absolute value'
    },
    {
      name: 'POWER',
      syntax: 'POWER(<number>, <power>)',
      description: 'Returns the result of a number raised to a power.',
      example: 'Squared = POWER(Sales[Amount], 2)',
      usage: 'Exponentiation'
    }
  ],
  'Relationship': [
    {
      name: 'RELATED',
      syntax: 'RELATED(<column>)',
      description: 'Returns a related value from another table (many-to-one).',
      example: 'Product Category = RELATED(Products[Category])',
      usage: 'Follow relationships (many-to-one)'
    },
    {
      name: 'RELATEDTABLE',
      syntax: 'RELATEDTABLE(<table>)',
      description: 'Returns related rows from another table (one-to-many).',
      example: 'Customer Orders = COUNTROWS(RELATEDTABLE(Orders))',
      usage: 'Follow relationships (one-to-many)'
    },
    {
      name: 'USERELATIONSHIP',
      syntax: 'USERELATIONSHIP(<column1>, <column2>)',
      description: 'Activates an inactive relationship between tables.',
      example: 'Ship Date Sales = CALCULATE(SUM(Sales[Amount]), USERELATIONSHIP(Sales[ShipDate], Dates[Date]))',
      usage: 'Use inactive relationships'
    }
  ],
  'Table': [
    {
      name: 'ADDCOLUMNS',
      syntax: 'ADDCOLUMNS(<table>, <name>, <expression>, ...)',
      description: 'Adds calculated columns to a table.',
      example: 'Extended = ADDCOLUMNS(Products, "Tax", Products[Price] * 0.1)',
      usage: 'Add calculated columns to tables'
    },
    {
      name: 'SELECTCOLUMNS',
      syntax: 'SELECTCOLUMNS(<table>, <name>, <expression>, ...)',
      description: 'Returns a table with selected columns.',
      example: 'Product Names = SELECTCOLUMNS(Products, "Name", Products[ProductName])',
      usage: 'Select specific columns'
    },
    {
      name: 'SUMMARIZE',
      syntax: 'SUMMARIZE(<table>, <groupBy_column1>, ..., <name>, <expression>, ...)',
      description: 'Returns a summary table grouped by specified columns.',
      example: 'Sales By Category = SUMMARIZE(Sales, Products[Category], "Total", SUM(Sales[Amount]))',
      usage: 'Group and aggregate data'
    },
    {
      name: 'SUMMARIZECOLUMNS',
      syntax: 'SUMMARIZECOLUMNS(<groupBy_column1>, ..., <name>, <expression>, ...)',
      description: 'Returns a summary table with optimized performance.',
      example: 'Category Summary = SUMMARIZECOLUMNS(Products[Category], "Total Sales", SUM(Sales[Amount]))',
      usage: 'Modern grouping (preferred over SUMMARIZE)'
    },
    {
      name: 'CROSSJOIN',
      syntax: 'CROSSJOIN(<table1>, <table2>, ...)',
      description: 'Returns a table with all combinations of rows from specified tables.',
      example: 'All Combinations = CROSSJOIN(Products, Regions)',
      usage: 'Cartesian product of tables'
    },
    {
      name: 'UNION',
      syntax: 'UNION(<table1>, <table2>, ...)',
      description: 'Combines tables by appending rows.',
      example: 'All Sales = UNION(Sales2023, Sales2024)',
      usage: 'Combine tables vertically'
    },
    {
      name: 'INTERSECT',
      syntax: 'INTERSECT(<table1>, <table2>)',
      description: 'Returns rows that appear in both tables.',
      example: 'Common Customers = INTERSECT(Customers2023, Customers2024)',
      usage: 'Find common rows'
    },
    {
      name: 'EXCEPT',
      syntax: 'EXCEPT(<table1>, <table2>)',
      description: 'Returns rows from table1 that are not in table2.',
      example: 'New Customers = EXCEPT(Customers2024, Customers2023)',
      usage: 'Find differences between tables'
    }
  ]
};

const FunctionCard = ({ func }) => {
  const [copied, setCopied] = useState(false);

  const copyExample = () => {
    navigator.clipboard.writeText(func.example);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-bold text-indigo-600">{func.name}</h3>
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
          {func.usage}
        </span>
      </div>

      <div className="mb-3">
        <code className="text-sm bg-gray-50 text-gray-800 px-2 py-1 rounded block">
          {func.syntax}
        </code>
      </div>

      <p className="text-sm text-gray-600 mb-3">{func.description}</p>

      <div className="bg-indigo-50 rounded p-3 border border-indigo-100">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-indigo-700">Example:</span>
          <button
            onClick={copyExample}
            className="text-indigo-600 hover:text-indigo-800 transition-colors"
            title="Copy example"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        <code className="text-sm text-indigo-900 block">{func.example}</code>
      </div>
    </div>
  );
};

const CategorySection = ({ category, functions, isExpanded, onToggle }) => {
  return (
    <div className="mb-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-4 py-3 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-md"
      >
        <div className="flex items-center space-x-2">
          {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          <span className="font-bold text-lg">{category}</span>
          <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-sm">
            {functions.length} functions
          </span>
        </div>
      </button>

      {isExpanded && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {functions.map((func, index) => (
            <FunctionCard key={index} func={func} />
          ))}
        </div>
      )}
    </div>
  );
};

const DAXFunctionReference = ({ searchTerm, setSearchTerm }) => {
  const [expandedCategories, setExpandedCategories] = useState({
    'Aggregation': true
  });

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const filteredFunctions = useMemo(() => {
    if (!searchTerm) return daxFunctions;

    const filtered = {};
    Object.entries(daxFunctions).forEach(([category, functions]) => {
      const matchingFunctions = functions.filter(func =>
        func.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        func.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        func.usage.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (matchingFunctions.length > 0) {
        filtered[category] = matchingFunctions;
      }
    });

    return filtered;
  }, [searchTerm]);

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search DAX functions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Function Categories */}
      <div>
        {Object.entries(filteredFunctions).map(([category, functions]) => (
          <CategorySection
            key={category}
            category={category}
            functions={functions}
            isExpanded={expandedCategories[category]}
            onToggle={() => toggleCategory(category)}
          />
        ))}
      </div>

      {Object.keys(filteredFunctions).length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No functions found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
};

export default DAXFunctionReference;

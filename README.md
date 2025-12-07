# Production Schedule Viewer

A professional web-based production schedule viewer and analysis application for manufacturing operations management.

## Features

### 📊 Interactive Schedule Visualization
- **Gantt Chart Timeline View**: Visualize all production lines simultaneously with an interactive Gantt chart
- **Color-Coded Status**: Easy identification of Run (green), Setup (yellow), and Down (red) activities
- **Interactive Drill-Down**: Click any job block to view detailed information including work orders, products, times, and tonnage
- **Multi-Line Display**: View all 5 production lines (ICN, IST, IRS, IAL, ITF) at once

### 📈 Comprehensive Analytics Dashboard
- **Overall Metrics**: Total jobs, efficiency, run time, tonnage, and downtime statistics
- **Line Efficiency Comparison**: Compare performance across all production lines
- **Time Distribution Analysis**: Visualize how production time is allocated
- **Changeover Frequency Analysis**: Identify setup patterns and frequencies
- **Labor Demand Visualization**: See concurrent line activity and peak demand periods
- **Product Run Statistics**: Analyze run counts, durations, and tonnage by product

### 💡 Optimization Insights
- **Short Run Detection**: Identify production runs under 2 hours that could be consolidated
- **Excessive Changeover Analysis**: Find opportunities to reduce setup time by consolidating runs
- **Potential Time Savings**: Calculate estimated time savings through optimization
- **Actionable Recommendations**: Get specific suggestions for schedule improvements
- **Best Practices Guide**: Learn industry-standard optimization techniques

### 🔍 Advanced Filtering
- Filter by production line, status, product code
- Date range filtering
- Dynamic filter updates across all views

### 📤 Export Capabilities
- Export filtered data to CSV format
- Maintain data integrity for further analysis

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Origins
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

### Data Format

The application accepts CSV or Excel files (.csv, .xlsx, .xls) with the following columns:

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| ProductionLine | String | Production line identifier | ICN, IST, IRS, IAL, ITF |
| LineStatus | String | Status of the line | Run, Setup, Down |
| ProductCode | String | Product identifier | PROD-A123 |
| WorkOrder | String | Work order number | WO-001 |
| Start | DateTime | Job start time | 2024-01-15T08:00:00 |
| Finish | DateTime | Job finish time | 2024-01-15T16:00:00 |
| Tonnage | Number | Production tonnage | 25.5 |
| JobDetails | String | Additional job information | Optional notes |

**Sample Data**: See `sample-data.csv` for an example of the expected format.

### Loading Data

1. Launch the application
2. Click "Choose File" on the upload screen
3. Select your CSV or Excel file containing production schedule data
4. The application will automatically parse and display the data

### Navigating Views

The application has three main views accessible via the top navigation tabs:

1. **Schedule View**: Interactive Gantt chart showing the production timeline
2. **Analytics**: Comprehensive dashboard with metrics and charts
3. **Optimization Insights**: Recommendations for schedule improvements

### Using Filters

- Use the filter dropdowns to narrow down the data by:
  - Production Line
  - Line Status (Run/Setup/Down)
  - Product Code
- Filters apply across all views
- Click "Export Data" to download filtered results

### Interpreting the Gantt Chart

- **Horizontal Axis**: Time (days and hours)
- **Vertical Axis**: Production lines
- **Color Coding**:
  - 🟢 Green: Production runs
  - 🟡 Yellow: Setup/changeover
  - 🔴 Red: Downtime
- **Job Blocks**: Show product code and duration
- **Hover**: See quick job information
- **Click**: Open detailed job modal

## Technical Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Charts**: Recharts
- **Data Parsing**: PapaParse (CSV) & SheetJS (Excel)
- **Date Handling**: date-fns
- **Icons**: Lucide React

## Project Structure

```
Origins/
├── src/
│   ├── components/
│   │   ├── AnalyticsDashboard.jsx   # Analytics view with charts
│   │   ├── FileUpload.jsx           # File upload component
│   │   ├── FilterBar.jsx            # Filtering controls
│   │   ├── GanttChart.jsx           # Main schedule visualization
│   │   ├── JobDetailsModal.jsx      # Job details popup
│   │   └── OptimizationInsights.jsx # Optimization recommendations
│   ├── utils/
│   │   ├── analytics.js             # Analytics calculations
│   │   └── dataTypes.js             # Data models and utilities
│   ├── styles/
│   │   └── index.css                # Global styles
│   ├── App.jsx                      # Main application component
│   └── main.jsx                     # Application entry point
├── public/                          # Static assets
├── index.html                       # HTML template
├── package.json                     # Dependencies and scripts
├── vite.config.js                   # Vite configuration
└── sample-data.csv                  # Sample data file
```

## Key Metrics Explained

### Efficiency
Calculated as: `(Run Time / Total Time) × 100`
- Measures the percentage of time spent in productive runs vs. total time
- Higher efficiency indicates better resource utilization

### Changeover Rate
Calculated as: `(Number of Changeovers / Total Jobs) × 100`
- Indicates how frequently product changes occur
- Lower rates suggest better run consolidation

### Labor Demand
- **Max Concurrent Lines**: Highest number of lines active simultaneously
- **Avg Concurrent Lines**: Average number of lines active over time
- Helps in workforce planning and resource allocation

## Optimization Strategies

The application identifies several optimization opportunities:

1. **Short Run Consolidation**: Combine runs shorter than 2 hours to reduce setup frequency
2. **Product Batching**: Schedule similar products consecutively to minimize changeovers
3. **Campaign Production**: Run products in campaigns to reduce total changeovers
4. **Setup Reduction**: Use SMED techniques to reduce changeover times

## Future Enhancements

- Database integration for persistent storage
- Real-time data updates
- Advanced forecasting and planning tools
- Multi-user collaboration features
- Custom report generation
- Mobile responsive improvements

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## License

This project is licensed under the MIT License.

## Support

For questions or support, please open an issue in the repository.

---

**Built for Manufacturing Excellence** 🏭

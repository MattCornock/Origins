import React, { useState, useCallback } from 'react';
import { BarChart3, TrendingUp, Lightbulb } from 'lucide-react';
import FileUpload from './components/FileUpload';
import FilterBar from './components/FilterBar';
import GanttChart from './components/GanttChart';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import OptimizationInsights from './components/OptimizationInsights';

const TABS = {
  SCHEDULE: 'schedule',
  ANALYTICS: 'analytics',
  INSIGHTS: 'insights'
};

function App() {
  const [jobs, setJobs] = useState([]);
  const [activeTab, setActiveTab] = useState(TABS.SCHEDULE);
  const [filters, setFilters] = useState({
    line: 'all',
    status: 'all',
    product: 'all',
    startDate: null,
    endDate: null
  });

  const handleDataLoaded = useCallback((loadedJobs) => {
    setJobs(loadedJobs);
    console.log(`Loaded ${loadedJobs.length} jobs`);
  }, []);

  const handleExport = useCallback(() => {
    if (jobs.length === 0) {
      alert('No data to export');
      return;
    }

    // Convert jobs to CSV
    const headers = [
      'Production Line',
      'Line Status',
      'Product Code',
      'Work Order',
      'Start Time',
      'Finish Time',
      'Duration (hours)',
      'Tonnage'
    ];

    const csvContent = [
      headers.join(','),
      ...jobs.map(job => [
        job.productionLine,
        job.lineStatus,
        job.productCode,
        job.workOrder,
        job.start.toISOString(),
        job.finish.toISOString(),
        job.getDuration().toFixed(2),
        job.tonnage
      ].join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `production-schedule-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, [jobs]);

  const handleNewUpload = useCallback(() => {
    if (window.confirm('Upload new data? This will replace the current data.')) {
      setJobs([]);
      setFilters({
        line: 'all',
        status: 'all',
        product: 'all',
        startDate: null,
        endDate: null
      });
      setActiveTab(TABS.SCHEDULE);
    }
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="header">
        <div className="header-content">
          <h1 className="header-title">Production Schedule Viewer</h1>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>
            Manufacturing Operations Management
          </div>
        </div>
      </div>

      <div className="container">
        {jobs.length === 0 ? (
          <FileUpload onDataLoaded={handleDataLoaded} />
        ) : (
          <>
            {/* Filters */}
            <FilterBar
              jobs={jobs}
              filters={filters}
              onFilterChange={setFilters}
              onExport={handleExport}
              onNewUpload={handleNewUpload}
            />

            {/* Navigation Tabs */}
            <div className="nav-tabs">
              <button
                className={`nav-tab ${activeTab === TABS.SCHEDULE ? 'active' : ''}`}
                onClick={() => setActiveTab(TABS.SCHEDULE)}
              >
                <BarChart3 size={16} style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }} />
                Schedule View
              </button>
              <button
                className={`nav-tab ${activeTab === TABS.ANALYTICS ? 'active' : ''}`}
                onClick={() => setActiveTab(TABS.ANALYTICS)}
              >
                <TrendingUp size={16} style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }} />
                Analytics
              </button>
              <button
                className={`nav-tab ${activeTab === TABS.INSIGHTS ? 'active' : ''}`}
                onClick={() => setActiveTab(TABS.INSIGHTS)}
              >
                <Lightbulb size={16} style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }} />
                Optimization Insights
              </button>
            </div>

            {/* Content */}
            <div>
              {activeTab === TABS.SCHEDULE && (
                <div className="card">
                  <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
                    Production Schedule Gantt Chart
                  </h2>
                  <GanttChart jobs={jobs} filters={filters} />
                </div>
              )}

              {activeTab === TABS.ANALYTICS && (
                <AnalyticsDashboard jobs={jobs} />
              )}

              {activeTab === TABS.INSIGHTS && (
                <OptimizationInsights jobs={jobs} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;

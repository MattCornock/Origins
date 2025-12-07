import React, { useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PRODUCTION_LINES } from '../utils/dataTypes';
import {
  calculateLineEfficiency,
  calculateOverallMetrics,
  calculateChangeoverFrequency,
  calculateLaborDemand,
  getProductRunStatistics
} from '../utils/analytics';

const AnalyticsDashboard = ({ jobs }) => {
  const overallMetrics = useMemo(() => calculateOverallMetrics(jobs), [jobs]);
  const lineEfficiencies = useMemo(
    () => PRODUCTION_LINES.map(line => calculateLineEfficiency(jobs, line)),
    [jobs]
  );
  const changeoverStats = useMemo(() => calculateChangeoverFrequency(jobs), [jobs]);
  const laborDemand = useMemo(() => calculateLaborDemand(jobs), [jobs]);
  const productStats = useMemo(() => getProductRunStatistics(jobs), [jobs]);

  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];

  // Prepare data for charts
  const efficiencyData = lineEfficiencies.map(line => ({
    line: line.line,
    efficiency: parseFloat(line.efficiency),
    runTime: parseFloat(line.runTime),
    setupTime: parseFloat(line.setupTime),
    downTime: parseFloat(line.downTime)
  }));

  const timeDistributionData = [
    { name: 'Run Time', value: parseFloat(overallMetrics.totalRunTime), color: '#10b981' },
    { name: 'Setup Time', value: parseFloat(overallMetrics.totalSetupTime), color: '#f59e0b' },
    { name: 'Down Time', value: parseFloat(overallMetrics.totalDownTime), color: '#ef4444' }
  ];

  // Sample labor demand data (take every 24th hour to show daily pattern)
  const laborDemandSample = laborDemand.demandData
    .filter((_, index) => index % 24 === 0)
    .slice(0, 14); // Show max 2 weeks

  return (
    <div>
      {/* Overall Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <MetricCard
          title="Total Jobs"
          value={overallMetrics.totalJobs}
          subtitle="Scheduled"
        />
        <MetricCard
          title="Overall Efficiency"
          value={`${overallMetrics.overallEfficiency}%`}
          subtitle="Run time / Total time"
        />
        <MetricCard
          title="Total Run Time"
          value={`${parseFloat(overallMetrics.totalRunTime).toFixed(0)}h`}
          subtitle="Production time"
        />
        <MetricCard
          title="Total Tonnage"
          value={parseFloat(overallMetrics.totalTonnage).toFixed(0)}
          subtitle="Tons produced"
        />
        <MetricCard
          title="Setup Time"
          value={`${parseFloat(overallMetrics.totalSetupTime).toFixed(0)}h`}
          subtitle="Changeover time"
        />
        <MetricCard
          title="Down Time"
          value={`${parseFloat(overallMetrics.totalDownTime).toFixed(0)}h`}
          subtitle="Unproductive time"
        />
      </div>

      {/* Charts Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Line Efficiency Bar Chart */}
        <div className="card">
          <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>
            Line Efficiency Comparison
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={efficiencyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="line" />
              <YAxis label={{ value: 'Efficiency %', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="efficiency" fill="#3b82f6" name="Efficiency %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Time Distribution Pie Chart */}
        <div className="card">
          <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>
            Time Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={timeDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value.toFixed(0)}h`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {timeDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Run Time vs Setup Time */}
        <div className="card">
          <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>
            Run Time vs Setup Time by Line
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={efficiencyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="line" />
              <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="runTime" fill="#10b981" name="Run Time" />
              <Bar dataKey="setupTime" fill="#f59e0b" name="Setup Time" />
              <Bar dataKey="downTime" fill="#ef4444" name="Down Time" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Labor Demand Over Time */}
        <div className="card">
          <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>
            Concurrent Line Activity
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={laborDemandSample}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                tickFormatter={(time) => {
                  const date = new Date(time);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
              />
              <YAxis label={{ value: 'Active Lines', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                labelFormatter={(time) => new Date(time).toLocaleDateString()}
              />
              <Legend />
              <Line type="monotone" dataKey="totalLinesActive" stroke="#3b82f6" name="Total Active" strokeWidth={2} />
              <Line type="monotone" dataKey="linesRunning" stroke="#10b981" name="Running" strokeWidth={2} />
              <Line type="monotone" dataKey="linesInSetup" stroke="#f59e0b" name="In Setup" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Line Performance Table */}
      <div className="card">
        <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>
          Line Performance Details
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid var(--color-border)' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}>Line</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', fontSize: '14px' }}>Jobs</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', fontSize: '14px' }}>Efficiency</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', fontSize: '14px' }}>Setups</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', fontSize: '14px' }}>Avg Setup</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', fontSize: '14px' }}>Avg Run</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', fontSize: '14px' }}>Tonnage</th>
              </tr>
            </thead>
            <tbody>
              {lineEfficiencies.map((line, index) => (
                <tr key={line.line} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '12px', fontWeight: '600' }}>{line.line}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>{line.totalJobs}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <span style={{
                      backgroundColor: parseFloat(line.efficiency) >= 70 ? '#d1fae5' : parseFloat(line.efficiency) >= 50 ? '#fef3c7' : '#fee2e2',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '13px',
                      fontWeight: '500'
                    }}>
                      {line.efficiency}%
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>{line.setupCount}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>{line.averageSetupDuration}h</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>{line.averageRunDuration}h</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>{line.totalTonnage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Changeover Frequency */}
      <div className="card">
        <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>
          Changeover Analysis
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid var(--color-border)' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}>Line</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', fontSize: '14px' }}>Total Jobs</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', fontSize: '14px' }}>Changeovers</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', fontSize: '14px' }}>Changeover Rate</th>
              </tr>
            </thead>
            <tbody>
              {changeoverStats.map((stat) => (
                <tr key={stat.line} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '12px', fontWeight: '600' }}>{stat.line}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>{stat.jobCount}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>{stat.changeovers}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>{stat.changeoverRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Products */}
      <div className="card">
        <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>
          Top Products by Run Count
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid var(--color-border)' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}>Product</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', fontSize: '14px' }}>Run Count</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', fontSize: '14px' }}>Avg Duration</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', fontSize: '14px' }}>Min Duration</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', fontSize: '14px' }}>Max Duration</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', fontSize: '14px' }}>Total Tonnage</th>
              </tr>
            </thead>
            <tbody>
              {productStats.slice(0, 10).map((product) => (
                <tr key={product.product} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '12px', fontWeight: '600' }}>{product.product}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>{product.runCount}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>{product.avgDuration}h</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>{product.minDuration}h</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>{product.maxDuration}h</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>{product.totalTonnage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Labor Demand Summary */}
      <div className="card">
        <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>
          Labor Demand Summary
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Max Concurrent Lines</div>
            <div style={{ fontSize: '32px', fontWeight: '600', color: '#3b82f6' }}>{laborDemand.maxConcurrent}</div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Peak simultaneous activity</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Avg Concurrent Lines</div>
            <div style={{ fontSize: '32px', fontWeight: '600', color: '#10b981' }}>{laborDemand.avgConcurrent}</div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Average simultaneous activity</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Total Lines</div>
            <div style={{ fontSize: '32px', fontWeight: '600', color: '#6b7280' }}>{PRODUCTION_LINES.length}</div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Available production lines</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, subtitle }) => (
  <div className="card">
    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '500' }}>
      {title}
    </div>
    <div style={{ fontSize: '28px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
      {value}
    </div>
    <div style={{ fontSize: '12px', color: '#6b7280' }}>
      {subtitle}
    </div>
  </div>
);

export default AnalyticsDashboard;

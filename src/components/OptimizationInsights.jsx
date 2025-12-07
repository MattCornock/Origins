import React, { useMemo } from 'react';
import { AlertCircle, TrendingUp, Package, Clock } from 'lucide-react';
import { findShortRuns, findExcessiveChangeovers } from '../utils/analytics';
import { format } from 'date-fns';

const OptimizationInsights = ({ jobs }) => {
  const shortRuns = useMemo(() => findShortRuns(jobs, 2), [jobs]);
  const changeoverIssues = useMemo(() => findExcessiveChangeovers(jobs), [jobs]);

  // Calculate potential savings
  const potentialSavings = useMemo(() => {
    const shortRunCount = shortRuns.length;
    const changeoverIssueCount = changeoverIssues.length;

    // Estimate time that could be saved
    const shortRunTimeSaved = shortRuns.reduce((sum, job) => sum + job.getDuration(), 0);
    const estimatedSetupTimeSaved = changeoverIssueCount * 2; // Assume 2 hours per changeover

    return {
      shortRunCount,
      changeoverIssueCount,
      shortRunTimeSaved: shortRunTimeSaved.toFixed(1),
      estimatedSetupTimeSaved: estimatedSetupTimeSaved.toFixed(1),
      totalPotentialSavings: (shortRunTimeSaved * 0.3 + estimatedSetupTimeSaved).toFixed(1) // 30% of short run time could be saved
    };
  }, [shortRuns, changeoverIssues]);

  // Group short runs by product
  const shortRunsByProduct = useMemo(() => {
    const grouped = {};
    shortRuns.forEach(job => {
      if (!grouped[job.productCode]) {
        grouped[job.productCode] = [];
      }
      grouped[job.productCode].push(job);
    });
    return Object.entries(grouped)
      .map(([product, jobs]) => ({
        product,
        count: jobs.length,
        totalDuration: jobs.reduce((sum, job) => sum + job.getDuration(), 0),
        jobs
      }))
      .sort((a, b) => b.count - a.count);
  }, [shortRuns]);

  return (
    <div>
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <InsightCard
          icon={<Clock size={24} color="#f59e0b" />}
          title="Short Runs Detected"
          value={potentialSavings.shortRunCount}
          subtitle={`${potentialSavings.shortRunTimeSaved}h total duration`}
          color="#f59e0b"
        />
        <InsightCard
          icon={<Package size={24} color="#ef4444" />}
          title="Excessive Changeovers"
          value={potentialSavings.changeoverIssueCount}
          subtitle="Could be consolidated"
          color="#ef4444"
        />
        <InsightCard
          icon={<TrendingUp size={24} color="#10b981" />}
          title="Potential Time Savings"
          value={`${potentialSavings.totalPotentialSavings}h`}
          subtitle="Through optimization"
          color="#10b981"
        />
        <InsightCard
          icon={<AlertCircle size={24} color="#3b82f6" />}
          title="Setup Time Reduction"
          value={`${potentialSavings.estimatedSetupTimeSaved}h`}
          subtitle="By consolidating runs"
          color="#3b82f6"
        />
      </div>

      {/* Short Runs Section */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <Clock size={24} color="#f59e0b" />
          <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>
            Short Runs (Less than 2 hours)
          </h3>
        </div>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px' }}>
          These short production runs may indicate opportunities for consolidation, which could reduce setup time and improve efficiency.
        </p>

        {shortRunsByProduct.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
            No short runs detected. All production runs are longer than 2 hours.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid var(--color-border)' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}>Product</th>
                  <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', fontSize: '14px' }}>Occurrences</th>
                  <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', fontSize: '14px' }}>Total Duration</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}>Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {shortRunsByProduct.slice(0, 15).map((item) => (
                  <tr key={item.product} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '12px', fontWeight: '600' }}>{item.product}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>{item.count}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>{item.totalDuration.toFixed(2)}h</td>
                    <td style={{ padding: '12px', fontSize: '13px', color: '#6b7280' }}>
                      {item.count > 1
                        ? `Consider consolidating ${item.count} runs into fewer, longer runs`
                        : 'Consider combining with other products or extending run length'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Excessive Changeovers Section */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <Package size={24} color="#ef4444" />
          <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>
            Changeover Optimization Opportunities
          </h3>
        </div>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px' }}>
          These products are scheduled multiple times with changeovers in between. Consolidating these runs could reduce setup time.
        </p>

        {changeoverIssues.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
            No excessive changeover issues detected. Production scheduling appears optimized.
          </div>
        ) : (
          <div>
            {changeoverIssues.slice(0, 20).map((issue, index) => (
              <div
                key={index}
                style={{
                  padding: '16px',
                  marginBottom: '12px',
                  backgroundColor: '#fef3c7',
                  borderLeft: '4px solid #f59e0b',
                  borderRadius: '6px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '15px', marginBottom: '4px' }}>
                      {issue.line}: {issue.product}
                    </div>
                    <div style={{ fontSize: '13px', color: '#78716c' }}>
                      {issue.message}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
                  <div style={{ fontSize: '12px' }}>
                    <strong>First Run:</strong> {format(issue.firstOccurrence.start, 'MMM dd, HH:mm')}
                    {' → '}
                    {format(issue.firstOccurrence.finish, 'HH:mm')}
                    {' '}({issue.firstOccurrence.getDuration().toFixed(1)}h)
                  </div>
                  <div style={{ fontSize: '12px' }}>
                    <strong>Later Run:</strong> {format(issue.laterOccurrence.start, 'MMM dd, HH:mm')}
                    {' → '}
                    {format(issue.laterOccurrence.finish, 'HH:mm')}
                    {' '}({issue.laterOccurrence.getDuration().toFixed(1)}h)
                  </div>
                </div>
                <div style={{ marginTop: '12px', padding: '8px', backgroundColor: 'white', borderRadius: '4px', fontSize: '13px' }}>
                  <strong>💡 Recommendation:</strong> Consider scheduling both runs consecutively to eliminate at least one changeover,
                  saving approximately 1-2 hours of setup time.
                </div>
              </div>
            ))}
            {changeoverIssues.length > 20 && (
              <div style={{ textAlign: 'center', padding: '12px', color: '#6b7280', fontSize: '14px' }}>
                Showing 20 of {changeoverIssues.length} issues
              </div>
            )}
          </div>
        )}
      </div>

      {/* Optimization Tips */}
      <div className="card" style={{ marginTop: '20px', backgroundColor: '#f0f9ff', border: '1px solid #bfdbfe' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <TrendingUp size={24} color="#3b82f6" />
          <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0, color: '#1e40af' }}>
            Optimization Best Practices
          </h3>
        </div>
        <ul style={{ fontSize: '14px', color: '#1e40af', lineHeight: '1.8', paddingLeft: '20px' }}>
          <li>
            <strong>Batch Similar Products:</strong> Group production of the same product to minimize changeovers
          </li>
          <li>
            <strong>Minimum Run Length:</strong> Establish minimum run lengths (e.g., 4-6 hours) to improve efficiency
          </li>
          <li>
            <strong>Product Sequencing:</strong> Schedule product runs in a logical sequence to reduce setup complexity
          </li>
          <li>
            <strong>Campaign Production:</strong> Consider running campaigns of similar products to reduce total changeovers
          </li>
          <li>
            <strong>Setup Reduction:</strong> Invest in SMED (Single-Minute Exchange of Dies) techniques to reduce changeover times
          </li>
          <li>
            <strong>Demand Forecasting:</strong> Improve demand forecasting to allow for better run consolidation planning
          </li>
        </ul>
      </div>
    </div>
  );
};

const InsightCard = ({ icon, title, value, subtitle, color }) => (
  <div className="card" style={{ borderTop: `3px solid ${color}` }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
      {icon}
      <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '500' }}>
        {title}
      </div>
    </div>
    <div style={{ fontSize: '32px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
      {value}
    </div>
    <div style={{ fontSize: '13px', color: '#6b7280' }}>
      {subtitle}
    </div>
  </div>
);

export default OptimizationInsights;

import React, { useMemo } from 'react';
import { Filter, Download, Upload } from 'lucide-react';
import { PRODUCTION_LINES, LINE_STATUS, getDateRange } from '../utils/dataTypes';
import { format } from 'date-fns';

const FilterBar = ({ jobs, filters, onFilterChange, onExport, onNewUpload }) => {
  const uniqueProducts = useMemo(() => {
    const products = new Set(jobs.map(job => job.productCode));
    return Array.from(products).sort();
  }, [jobs]);

  const dateRange = useMemo(() => getDateRange(jobs), [jobs]);

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="card" style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <Filter size={20} />
        <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>Filters</h3>
      </div>

      <div className="filter-bar">
        <select
          className="filter-select"
          value={filters.line || 'all'}
          onChange={(e) => handleFilterChange('line', e.target.value)}
        >
          <option value="all">All Lines</option>
          {PRODUCTION_LINES.map(line => (
            <option key={line} value={line}>{line}</option>
          ))}
        </select>

        <select
          className="filter-select"
          value={filters.status || 'all'}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="all">All Statuses</option>
          {Object.values(LINE_STATUS).map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>

        <select
          className="filter-select"
          value={filters.product || 'all'}
          onChange={(e) => handleFilterChange('product', e.target.value)}
          style={{ minWidth: '200px' }}
        >
          <option value="all">All Products</option>
          {uniqueProducts.map(product => (
            <option key={product} value={product}>{product}</option>
          ))}
        </select>

        <div style={{ flex: 1 }} />

        <button className="button button-secondary" onClick={onNewUpload} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Upload size={16} />
          New Upload
        </button>

        <button className="button button-primary" onClick={onExport} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Download size={16} />
          Export Data
        </button>
      </div>

      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '12px' }}>
        Date Range: {format(dateRange.start, 'MMM dd, yyyy')} - {format(dateRange.end, 'MMM dd, yyyy')}
        {' • '}
        Total Jobs: {jobs.length}
      </div>
    </div>
  );
};

export default FilterBar;

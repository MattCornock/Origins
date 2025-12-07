import React, { useState, useMemo, useRef, useEffect } from 'react';
import { format, addDays, differenceInDays, startOfDay, addHours } from 'date-fns';
import { PRODUCTION_LINES, getDateRange } from '../utils/dataTypes';
import JobDetailsModal from './JobDetailsModal';

const GanttChart = ({ jobs, filters }) => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [hoveredJob, setHoveredJob] = useState(null);
  const chartRef = useRef(null);

  // Filter jobs based on filters
  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    if (filters.line && filters.line !== 'all') {
      result = result.filter(job => job.productionLine === filters.line);
    }

    if (filters.status && filters.status !== 'all') {
      result = result.filter(job => job.lineStatus === filters.status);
    }

    if (filters.product && filters.product !== 'all') {
      result = result.filter(job => job.productCode === filters.product);
    }

    if (filters.startDate) {
      result = result.filter(job => job.start >= new Date(filters.startDate));
    }

    if (filters.endDate) {
      result = result.filter(job => job.finish <= new Date(filters.endDate));
    }

    return result;
  }, [jobs, filters]);

  const dateRange = useMemo(() => getDateRange(filteredJobs), [filteredJobs]);
  const totalDays = differenceInDays(dateRange.end, dateRange.start) + 1;

  // Lines to display based on filter
  const displayLines = useMemo(() => {
    if (filters.line && filters.line !== 'all') {
      return [filters.line];
    }
    return PRODUCTION_LINES;
  }, [filters.line]);

  const getJobPosition = (job) => {
    const startDiff = (job.start - dateRange.start) / (1000 * 60 * 60); // hours from start
    const duration = job.getDuration();
    const totalHours = totalDays * 24;

    return {
      left: `${(startDiff / totalHours) * 100}%`,
      width: `${(duration / totalHours) * 100}%`
    };
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
  };

  if (filteredJobs.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state-description">No jobs match the current filters.</p>
      </div>
    );
  }

  // Chart dimensions
  const ROW_HEIGHT = 60;
  const HEADER_HEIGHT = 80;
  const LINE_LABEL_WIDTH = 100;
  const chartHeight = displayLines.length * ROW_HEIGHT + HEADER_HEIGHT;

  return (
    <div style={{ position: 'relative' }}>
      <div
        ref={chartRef}
        style={{
          overflowX: 'auto',
          overflowY: 'visible',
          border: '1px solid var(--color-border)',
          borderRadius: '8px',
          backgroundColor: 'white'
        }}
      >
        <div style={{ minWidth: '1200px', position: 'relative', height: chartHeight }}>
          {/* Time header */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: LINE_LABEL_WIDTH,
              right: 0,
              height: HEADER_HEIGHT,
              borderBottom: '2px solid var(--color-border)',
              backgroundColor: '#f9fafb'
            }}
          >
            <div style={{ display: 'flex', height: '100%' }}>
              {Array.from({ length: totalDays }).map((_, dayIndex) => {
                const currentDay = addDays(dateRange.start, dayIndex);
                return (
                  <div
                    key={dayIndex}
                    style={{
                      flex: 1,
                      borderRight: '1px solid var(--color-border)',
                      padding: '8px',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>
                      {format(currentDay, 'MMM dd')}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                      {format(currentDay, 'EEE')}
                    </div>
                    {/* Hour markers */}
                    <div style={{ display: 'flex', marginTop: '8px', fontSize: '10px', color: '#9ca3af' }}>
                      <span style={{ flex: 1 }}>00</span>
                      <span style={{ flex: 1 }}>06</span>
                      <span style={{ flex: 1 }}>12</span>
                      <span style={{ flex: 1 }}>18</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Production lines */}
          {displayLines.map((line, lineIndex) => {
            const lineJobs = filteredJobs.filter(job => job.productionLine === line);

            return (
              <div key={line} style={{ position: 'relative' }}>
                {/* Line label */}
                <div
                  style={{
                    position: 'absolute',
                    top: HEADER_HEIGHT + lineIndex * ROW_HEIGHT,
                    left: 0,
                    width: LINE_LABEL_WIDTH,
                    height: ROW_HEIGHT,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '600',
                    fontSize: '14px',
                    backgroundColor: '#f9fafb',
                    borderRight: '2px solid var(--color-border)',
                    borderBottom: '1px solid var(--color-border)'
                  }}
                >
                  {line}
                </div>

                {/* Line background */}
                <div
                  style={{
                    position: 'absolute',
                    top: HEADER_HEIGHT + lineIndex * ROW_HEIGHT,
                    left: LINE_LABEL_WIDTH,
                    right: 0,
                    height: ROW_HEIGHT,
                    borderBottom: '1px solid var(--color-border)'
                  }}
                >
                  {/* Day dividers */}
                  {Array.from({ length: totalDays }).map((_, dayIndex) => (
                    <div
                      key={dayIndex}
                      style={{
                        position: 'absolute',
                        left: `${(dayIndex / totalDays) * 100}%`,
                        width: `${(1 / totalDays) * 100}%`,
                        height: '100%',
                        borderRight: '1px solid #e5e7eb'
                      }}
                    />
                  ))}

                  {/* Job blocks */}
                  {lineJobs.map((job, jobIndex) => {
                    const position = getJobPosition(job);
                    const isHovered = hoveredJob?.id === job.id;

                    return (
                      <div
                        key={job.id || jobIndex}
                        style={{
                          position: 'absolute',
                          top: '8px',
                          height: ROW_HEIGHT - 16,
                          ...position,
                          backgroundColor: job.getColor(),
                          borderRadius: '4px',
                          cursor: 'pointer',
                          padding: '8px',
                          overflow: 'hidden',
                          boxShadow: isHovered ? '0 4px 6px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.1)',
                          transform: isHovered ? 'translateY(-2px)' : 'none',
                          transition: 'all 0.2s',
                          zIndex: isHovered ? 10 : 1,
                          border: '1px solid rgba(0,0,0,0.1)'
                        }}
                        onClick={() => handleJobClick(job)}
                        onMouseEnter={() => setHoveredJob(job)}
                        onMouseLeave={() => setHoveredJob(null)}
                      >
                        <div
                          style={{
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: '600',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                          }}
                        >
                          {job.productCode}
                        </div>
                        <div
                          style={{
                            color: 'rgba(255,255,255,0.9)',
                            fontSize: '10px',
                            marginTop: '2px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                          }}
                        >
                          {job.getDuration().toFixed(1)}h
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div style={{ marginTop: '20px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '20px', backgroundColor: 'var(--color-run)', borderRadius: '4px' }} />
          <span style={{ fontSize: '14px' }}>Run</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '20px', backgroundColor: 'var(--color-setup)', borderRadius: '4px' }} />
          <span style={{ fontSize: '14px' }}>Setup</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '20px', backgroundColor: 'var(--color-down)', borderRadius: '4px' }} />
          <span style={{ fontSize: '14px' }}>Down</span>
        </div>
      </div>

      {/* Tooltip for hovered job */}
      {hoveredJob && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: 'rgba(0,0,0,0.9)',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '12px',
            maxWidth: '300px',
            zIndex: 1000,
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
          }}
        >
          <div style={{ fontWeight: '600', marginBottom: '4px' }}>{hoveredJob.productCode}</div>
          <div>Work Order: {hoveredJob.workOrder}</div>
          <div>Duration: {hoveredJob.getDuration().toFixed(2)}h</div>
          <div style={{ marginTop: '4px', fontSize: '10px', opacity: 0.8 }}>
            Click for more details
          </div>
        </div>
      )}

      {selectedJob && (
        <JobDetailsModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  );
};

export default GanttChart;

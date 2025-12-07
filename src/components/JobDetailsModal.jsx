import React from 'react';
import { X } from 'lucide-react';
import { format } from 'date-fns';

const JobDetailsModal = ({ job, onClose }) => {
  if (!job) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Job Details</h2>
          <button onClick={onClose} className="close-button">
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          <div style={{ marginBottom: '20px' }}>
            <span className={`status-badge status-${job.lineStatus.toLowerCase()}`}>
              {job.lineStatus}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Work Order</div>
              <div style={{ fontWeight: '500', fontSize: '16px' }}>{job.workOrder}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Product Code</div>
              <div style={{ fontWeight: '500', fontSize: '16px' }}>{job.productCode}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Production Line</div>
              <div style={{ fontWeight: '500', fontSize: '16px' }}>{job.productionLine}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Duration</div>
              <div style={{ fontWeight: '500', fontSize: '16px' }}>{job.getDuration().toFixed(2)} hours</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Start Time</div>
              <div style={{ fontWeight: '500', fontSize: '14px' }}>
                {format(job.start, 'MMM dd, yyyy HH:mm')}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Finish Time</div>
              <div style={{ fontWeight: '500', fontSize: '14px' }}>
                {format(job.finish, 'MMM dd, yyyy HH:mm')}
              </div>
            </div>
            {job.tonnage > 0 && (
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Tonnage</div>
                <div style={{ fontWeight: '500', fontSize: '16px' }}>{job.tonnage.toFixed(2)} tons</div>
              </div>
            )}
            {job.jobDetails && (
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Job Details</div>
                <div style={{ fontWeight: '400', fontSize: '14px' }}>{job.jobDetails}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;

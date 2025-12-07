// Data types and constants for the production schedule viewer

export const PRODUCTION_LINES = ['ICN', 'IST', 'IRS', 'IAL', 'ITF'];

export const LINE_STATUS = {
  RUN: 'Run',
  SETUP: 'Setup',
  DOWN: 'Down'
};

export const STATUS_COLORS = {
  [LINE_STATUS.RUN]: '#10b981',    // Green
  [LINE_STATUS.SETUP]: '#f59e0b',  // Yellow/Orange
  [LINE_STATUS.DOWN]: '#ef4444'    // Red
};

export class ProductionJob {
  constructor(data) {
    this.id = data.id || `${data.workOrder}-${data.productionLine}-${data.start}`;
    this.productionLine = data.productionLine || data.ProductionLine;
    this.lineStatus = data.lineStatus || data.LineStatus;
    this.productCode = data.productCode || data.ProductCode;
    this.workOrder = data.workOrder || data.WorkOrder;
    this.start = new Date(data.start || data.Start);
    this.finish = new Date(data.finish || data.Finish);
    this.tonnage = parseFloat(data.tonnage || data.Tonnage || 0);
    this.jobDetails = data.jobDetails || data.JobDetails || '';
  }

  getDuration() {
    return (this.finish - this.start) / (1000 * 60 * 60); // Duration in hours
  }

  isSetup() {
    return this.lineStatus === LINE_STATUS.SETUP;
  }

  isRun() {
    return this.lineStatus === LINE_STATUS.RUN;
  }

  isDown() {
    return this.lineStatus === LINE_STATUS.DOWN;
  }

  getColor() {
    return STATUS_COLORS[this.lineStatus] || '#9ca3af';
  }
}

export const parseCSVData = (rawData) => {
  return rawData.map(row => new ProductionJob(row));
};

export const getDateRange = (jobs) => {
  if (!jobs || jobs.length === 0) {
    return { start: new Date(), end: new Date() };
  }

  const dates = jobs.flatMap(job => [job.start, job.finish]);
  return {
    start: new Date(Math.min(...dates)),
    end: new Date(Math.max(...dates))
  };
};

export const getJobsByLine = (jobs, line) => {
  return jobs.filter(job => job.productionLine === line);
};

export const getJobsByDateRange = (jobs, startDate, endDate) => {
  return jobs.filter(job => {
    return job.start >= startDate && job.finish <= endDate;
  });
};

export const getJobsByStatus = (jobs, status) => {
  return jobs.filter(job => job.lineStatus === status);
};

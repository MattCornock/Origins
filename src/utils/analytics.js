// Analytics calculations for production data

export const calculateLineEfficiency = (jobs, line) => {
  const lineJobs = jobs.filter(j => j.productionLine === line);

  if (lineJobs.length === 0) {
    return {
      line,
      totalJobs: 0,
      runTime: 0,
      setupTime: 0,
      downTime: 0,
      efficiency: 0,
      setupCount: 0,
      averageSetupDuration: 0,
      averageRunDuration: 0
    };
  }

  const runJobs = lineJobs.filter(j => j.isRun());
  const setupJobs = lineJobs.filter(j => j.isSetup());
  const downJobs = lineJobs.filter(j => j.isDown());

  const runTime = runJobs.reduce((sum, job) => sum + job.getDuration(), 0);
  const setupTime = setupJobs.reduce((sum, job) => sum + job.getDuration(), 0);
  const downTime = downJobs.reduce((sum, job) => sum + job.getDuration(), 0);

  const totalTime = runTime + setupTime + downTime;
  const efficiency = totalTime > 0 ? (runTime / totalTime) * 100 : 0;

  return {
    line,
    totalJobs: lineJobs.length,
    runTime: runTime.toFixed(2),
    setupTime: setupTime.toFixed(2),
    downTime: downTime.toFixed(2),
    efficiency: efficiency.toFixed(2),
    setupCount: setupJobs.length,
    averageSetupDuration: setupJobs.length > 0 ? (setupTime / setupJobs.length).toFixed(2) : 0,
    averageRunDuration: runJobs.length > 0 ? (runTime / runJobs.length).toFixed(2) : 0,
    totalTonnage: lineJobs.reduce((sum, job) => sum + job.tonnage, 0).toFixed(2)
  };
};

export const calculateOverallMetrics = (jobs) => {
  const totalRunTime = jobs.filter(j => j.isRun()).reduce((sum, job) => sum + job.getDuration(), 0);
  const totalSetupTime = jobs.filter(j => j.isSetup()).reduce((sum, job) => sum + job.getDuration(), 0);
  const totalDownTime = jobs.filter(j => j.isDown()).reduce((sum, job) => sum + job.getDuration(), 0);
  const totalTime = totalRunTime + totalSetupTime + totalDownTime;

  return {
    totalJobs: jobs.length,
    totalRunTime: totalRunTime.toFixed(2),
    totalSetupTime: totalSetupTime.toFixed(2),
    totalDownTime: totalDownTime.toFixed(2),
    overallEfficiency: totalTime > 0 ? ((totalRunTime / totalTime) * 100).toFixed(2) : 0,
    totalTonnage: jobs.reduce((sum, job) => sum + job.tonnage, 0).toFixed(2),
    averageJobDuration: jobs.length > 0 ? (totalTime / jobs.length).toFixed(2) : 0
  };
};

export const findShortRuns = (jobs, thresholdHours = 2) => {
  return jobs
    .filter(job => job.isRun() && job.getDuration() < thresholdHours)
    .sort((a, b) => a.getDuration() - b.getDuration());
};

export const findExcessiveChangeovers = (jobs) => {
  const jobsByLine = {};

  jobs.forEach(job => {
    if (!jobsByLine[job.productionLine]) {
      jobsByLine[job.productionLine] = [];
    }
    jobsByLine[job.productionLine].push(job);
  });

  const issues = [];

  Object.keys(jobsByLine).forEach(line => {
    const lineJobs = jobsByLine[line].sort((a, b) => a.start - b.start);
    const productSequence = lineJobs.map(j => ({ product: j.productCode, job: j }));

    for (let i = 1; i < productSequence.length; i++) {
      const current = productSequence[i];
      const previous = productSequence[i - 1];

      // Check if the same product appears after different products (potential consolidation opportunity)
      const sameProductIndex = productSequence.slice(0, i - 1).findIndex(p => p.product === current.product);
      if (sameProductIndex !== -1 && previous.product !== current.product) {
        issues.push({
          line: line,
          product: current.product,
          firstOccurrence: productSequence[sameProductIndex].job,
          laterOccurrence: current.job,
          message: `Product ${current.product} scheduled multiple times on ${line} with changeovers in between`
        });
      }
    }
  });

  return issues;
};

export const calculateChangeoverFrequency = (jobs) => {
  const jobsByLine = {};

  jobs.forEach(job => {
    if (!jobsByLine[job.productionLine]) {
      jobsByLine[job.productionLine] = [];
    }
    jobsByLine[job.productionLine].push(job);
  });

  const changeoverStats = [];

  Object.keys(jobsByLine).forEach(line => {
    const lineJobs = jobsByLine[line].sort((a, b) => a.start - b.start);
    let changeoverCount = 0;

    for (let i = 1; i < lineJobs.length; i++) {
      if (lineJobs[i].productCode !== lineJobs[i - 1].productCode) {
        changeoverCount++;
      }
    }

    changeoverStats.push({
      line,
      changeovers: changeoverCount,
      jobCount: lineJobs.length,
      changeoverRate: lineJobs.length > 0 ? (changeoverCount / lineJobs.length * 100).toFixed(2) : 0
    });
  });

  return changeoverStats;
};

export const calculateLaborDemand = (jobs) => {
  // Group jobs by time slots to see how many lines are running simultaneously
  const timeSlots = {};

  jobs.forEach(job => {
    const startHour = new Date(job.start);
    startHour.setMinutes(0, 0, 0);
    const endHour = new Date(job.finish);
    endHour.setMinutes(0, 0, 0);

    let currentHour = new Date(startHour);
    while (currentHour <= endHour) {
      const key = currentHour.toISOString();
      if (!timeSlots[key]) {
        timeSlots[key] = {
          time: new Date(currentHour),
          lines: new Set(),
          runningLines: new Set(),
          setupLines: new Set()
        };
      }
      timeSlots[key].lines.add(job.productionLine);
      if (job.isRun()) {
        timeSlots[key].runningLines.add(job.productionLine);
      } else if (job.isSetup()) {
        timeSlots[key].setupLines.add(job.productionLine);
      }
      currentHour.setHours(currentHour.getHours() + 1);
    }
  });

  const demandData = Object.values(timeSlots).map(slot => ({
    time: slot.time,
    totalLinesActive: slot.lines.size,
    linesRunning: slot.runningLines.size,
    linesInSetup: slot.setupLines.size
  })).sort((a, b) => a.time - b.time);

  const maxConcurrent = Math.max(...demandData.map(d => d.totalLinesActive), 0);
  const avgConcurrent = demandData.length > 0
    ? (demandData.reduce((sum, d) => sum + d.totalLinesActive, 0) / demandData.length).toFixed(2)
    : 0;

  return {
    demandData,
    maxConcurrent,
    avgConcurrent
  };
};

export const getProductRunStatistics = (jobs) => {
  const productStats = {};

  jobs.filter(j => j.isRun()).forEach(job => {
    if (!productStats[job.productCode]) {
      productStats[job.productCode] = {
        product: job.productCode,
        runCount: 0,
        totalDuration: 0,
        totalTonnage: 0,
        durations: []
      };
    }

    const duration = job.getDuration();
    productStats[job.productCode].runCount++;
    productStats[job.productCode].totalDuration += duration;
    productStats[job.productCode].totalTonnage += job.tonnage;
    productStats[job.productCode].durations.push(duration);
  });

  return Object.values(productStats).map(stat => {
    const sortedDurations = [...stat.durations].sort((a, b) => a - b);
    return {
      product: stat.product,
      runCount: stat.runCount,
      totalDuration: stat.totalDuration.toFixed(2),
      avgDuration: (stat.totalDuration / stat.runCount).toFixed(2),
      minDuration: Math.min(...stat.durations).toFixed(2),
      maxDuration: Math.max(...stat.durations).toFixed(2),
      totalTonnage: stat.totalTonnage.toFixed(2),
      avgTonnage: (stat.totalTonnage / stat.runCount).toFixed(2)
    };
  }).sort((a, b) => b.runCount - a.runCount);
};

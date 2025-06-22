import * as XLSX from 'xlsx';

// ⏱️ Extract time metadata
function getTimeMetadata() {
  const now = new Date();
  const weekNum = Math.ceil(
    ((now - new Date(now.getFullYear(), 0, 1)) / 86400000 + now.getDay() + 1) / 7
  );
  return {
    date: now.toISOString().split('T')[0],
    time: now.toTimeString().split(' ')[0],
    week: `W${weekNum}`,
    month: now.toLocaleString('default', { month: 'long' }),
    year: now.getFullYear(),
  };
}

// 📈 Calculate average and standard deviation
function calculateStats(samples) {
  if (!samples.length) return { average: 0, stdDev: 0 };

  const mean = samples.reduce((sum, val) => sum + val, 0) / samples.length;
  const stdDev = Math.sqrt(
    samples.reduce((sum, val) => sum + (val - mean) ** 2, 0) / samples.length
  );
  return {
    average: +mean.toFixed(2),
    stdDev: +stdDev.toFixed(2),
  };
}

// 🧾 Add or update a sheet with new row
function appendToSheet(workbook, sheetName, row, includeStats = false) {
  const existing = workbook.Sheets[sheetName];
  let data = existing ? XLSX.utils.sheet_to_json(existing) : [];

  data.push(row);

  if (includeStats) {
    data.push({});
    data.push({ Metric: 'Average', Value: row.average });
    data.push({ Metric: 'Std Dev', Value: row.stdDev });
  }

  const newSheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, newSheet, sheetName);
}

// 🚀 Main report generator
export function generateOrUpdateReport({
  fileName = 'SPC_Report.xlsx',
  newBatch = [],
  sampleCount = 0,
  chartType = 'X-R',
  autoDownload = true,
}) {
  const { date, time, week, month, year } = getTimeMetadata();
  const samples = newBatch.map((v) => v.sample);
  const highViolations = newBatch.filter((v) => v.severity === 'High').length;
  const mediumViolations = newBatch.filter((v) => v.severity === 'Medium').length;
  const { average, stdDev } = calculateStats(samples);

  const summary = {
    date,
    time,
    week,
    month,
    year,
    chartType,
    totalSamples: sampleCount,
    highViolations,
    mediumViolations,
    average,
    stdDev,
  };

  const workbook = XLSX.utils.book_new();

  appendToSheet(workbook, 'Weekly', summary);
  appendToSheet(workbook, 'Monthly', summary);
  appendToSheet(workbook, 'Yearly', summary, true); // Add stats footer

  if (autoDownload) {
    XLSX.writeFile(workbook, fileName);
    console.log(`✅ Report downloaded: ${fileName}`);
  }

  return workbook; // Optional: return for chaining or previewing
}
import React, { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Toaster, toast } from 'react-hot-toast';

import { evaluateViolations } from './utils/evaluateViolations';
import { generateOrUpdateReport } from './utils/reportManager';

import Header from './components/Header';
import MetricsPanel from './components/MetricsPanel';
import DataEntryForm from './components/DataEntryForm';
import ChartDisplay from './components/ChartDisplay';
import ViolationLog from './components/ViolationLog';
import FooterControls from './components/FooterControls';
import ExportPanel from './components/ExportPanel';
import NovaSplash from './components/NovaSplash';

function App() {
  const [samples, setSamples] = useState([]);
  const [violations, setViolations] = useState([]);
  const [formData, setFormData] = useState({
    sample: '',
    usl: '',
    lsl: '',
    ucl: '',
    lcl: '',
    chartType: 'X-R',
  });

  const [reportFileName, setReportFileName] = useState('');
  const [isDark, setIsDark] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const violationEndRef = useRef(null);
  const prevLengthRef = useRef(0);

  useEffect(() => {
    const root = document.documentElement;
    isDark ? root.classList.add('dark') : root.classList.remove('dark');
  }, [isDark]);

  useEffect(() => {
    const refreshed = evaluateViolations(samples, formData);
    setViolations(refreshed);
  }, [formData, samples]);

  useEffect(() => {
    const newCount = violations.length;
    const oldCount = prevLengthRef.current;

    if (newCount > oldCount) {
      violationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    prevLengthRef.current = newCount;
  }, [violations]);

  const handleExportMode = (mode) => {
    const file = reportFileName?.trim() !== '' ? reportFileName : 'SPC_Report.xlsx';
    const workbook = generateOrUpdateReport({
      fileName: file,
      newBatch: violations,
      sampleCount: samples.length,
      chartType: formData.chartType,
      autoDownload: false,
    });

    const selectedSheet = workbook.Sheets[mode];
    if (!selectedSheet) {
      toast.error(`❌ No data available for ${mode} report.`);
      return;
    }

    const exportWB = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(exportWB, selectedSheet, mode);
    XLSX.writeFile(exportWB, file.replace('.xlsx', `_${mode}.xlsx`));
    toast.success(`📄 ${mode} report exported.`);
  };

  if (showSplash) {
    return <NovaSplash onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div
      className={`App min-h-screen transition-colors duration-300 font-futuristic px-4 pb-12 ${
        isDark ? 'bg-darkBase text-mildNeon' : 'bg-cream text-gray-900'
      }`}
      style={{
        backgroundImage: isDark ? 'none' : 'url("/assets/wood-light.jpg")',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Theme Toggle */}
      <button
        onClick={() => setIsDark(!isDark)}
        className="fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 text-black dark:text-white px-4 py-2 rounded-full shadow-md transition-all hover:scale-105 hover:shadow-lg cursor-pointer text-2xl"
      >
        <span className="glow-icon">{isDark ? '🌙' : '☀️'}</span>
      </button>

      <Header />

      <MetricsPanel formData={formData} samples={samples} violations={violations} />

      <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto mt-6">
        <div className="lg:w-1/3 w-full bg-glass backdrop-blur-md border border-gray-700 dark:border-gray-600 rounded-lg shadow-lg p-6">
          <DataEntryForm
            formData={formData}
            setFormData={setFormData}
            setSamples={setSamples}
            setViolations={setViolations}
            reportFileName={reportFileName}
            setReportFileName={setReportFileName}
          />
        </div>

        <div className="lg:w-2/3 w-full bg-glass backdrop-blur-md border border-gray-700 dark:border-gray-600 rounded-lg shadow-lg p-6">
          <ChartDisplay formData={formData} samples={samples} isDark={isDark} />
        </div>
      </div>

      {violations.length === 0 ? (
        <p className="text-center text-sm text-green-500 mt-4">
          ✅ Process looks stable. No violations so far.
        </p>
      ) : (
        <p
          className={`text-sm text-center mt-4 font-medium ${
            violations[violations.length - 1].severity === 'High'
              ? 'text-red-500'
              : 'text-orange-400'
          }`}
        >
          Last violation: Sample {violations[violations.length - 1].index} –{' '}
          {violations[violations.length - 1].type}
        </p>
      )}

      <ViolationLog violations={violations} />
      <div ref={violationEndRef} />

      <ExportPanel
        reportFileName={reportFileName}
        setReportFileName={setReportFileName}
        handleExportMode={handleExportMode}
      />

      <FooterControls
        setSamples={setSamples}
        setFormData={setFormData}
        setViolations={setViolations}
      />

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}

export default App;
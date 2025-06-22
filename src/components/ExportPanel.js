import React from 'react';

function ExportPanel({ reportFileName, setReportFileName, handleExportMode }) {
  const modes = ['Weekly', 'Monthly', 'Yearly'];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 mt-8">
      {/* Centered file name input */}
      <div className="text-center">
        <input
          type="text"
          value={reportFileName}
          onChange={(e) => setReportFileName(e.target.value)}
          placeholder="SPC_Report.xlsx"
          className="bg-black bg-opacity-10 text-neon placeholder-gray-5000 px-6 py-3 border border-neon rounded w-full sm:w-2/3 lg:w-1/2 mx-auto focus:outline-none text-center"
        />
      </div>

      {/* Export options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {modes.map((mode) => (
          <div
            key={mode}
            className="hover-box bg-glass backdrop-blur-md border border-gray-700 dark:border-gray-500 rounded-lg p-6 shadow-md text-center"
          >
            <h3 className="text-neon text-md font-semibold mb-4">
              {mode === 'Weekly'
                ? '📊 Weekly Report'
                : mode === 'Monthly'
                ? '📆 Monthly Report'
                : '📅 Yearly Report'}
            </h3>
            <button
              onClick={() => handleExportMode(mode)}
              className="btn-neon btn-neon-glow"
            >
              Export {mode}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExportPanel;
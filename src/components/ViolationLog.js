import React from 'react';

function ViolationLog({ violations }) {
  if (!violations?.length) return null;

  const renderSymbol = (condition) =>
    condition === null ? '–' : condition ? '❌' : '✔️';

  const severityStyle = (level) =>
    level === 'High'
      ? 'text-red-500 font-bold'
      : level === 'Medium'
      ? 'text-yellow-400 font-medium'
      : 'text-gray-400';

  return (
    <section className="max-w-6xl mx-auto my-6 bg-glass dark:bg-glass backdrop-blur-md border border-gray-700 dark:border-gray-600 rounded-lg shadow-lg p-6 transition-all">
      <h2 className="text-lg font-semibold text-neon mb-4 tracking-wide">🧪 SPC Rule Diagnostics</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border-collapse text-gray-200">
          <thead className="bg-gray-800 dark:bg-gray-900 text-gray-400 uppercase text-xs tracking-wider">
            <tr>
              <th className="p-2 border-b border-gray-600">Sample</th>
              <th className="p-2 border-b border-gray-600 text-center">Above USL</th>
              <th className="p-2 border-b border-gray-600 text-center">Above UCL</th>
              <th className="p-2 border-b border-gray-600 text-center">Below LSL</th>
              <th className="p-2 border-b border-gray-600 text-center">Below LCL</th>
              <th className="p-2 border-b border-gray-600 text-center">Severity</th>
            </tr>
          </thead>
          <tbody>
            {violations.map((v, idx) => (
              <tr key={idx} className="hover:bg-gray-800 hover:bg-opacity-40 transition">
                <td className="p-2 border-b border-gray-700">{v.index}</td>
                <td className="p-2 border-b border-gray-700 text-center">{renderSymbol(v.aboveUSL)}</td>
                <td className="p-2 border-b border-gray-700 text-center">{renderSymbol(v.aboveUCL)}</td>
                <td className="p-2 border-b border-gray-700 text-center">{renderSymbol(v.belowLSL)}</td>
                <td className="p-2 border-b border-gray-700 text-center">{renderSymbol(v.belowLCL)}</td>
                <td className={`p-2 border-b border-gray-700 text-center ${severityStyle(v.severity)}`}>
                  {v.severity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default ViolationLog;
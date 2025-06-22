import React from 'react';

function MetricsPanel({ formData, samples, violations }) {
  const metrics = [
    { label: 'Samples', value: samples?.length || 0 },
    { label: 'Violations', value: violations?.length || 0 },
  ];

  const weekData = [
    { day: 'Mon', samples: 12, violations: 1 },
    { day: 'Tue', samples: 8, violations: 0 },
    { day: 'Wed', samples: 15, violations: 2 },
    { day: 'Thu', samples: 10, violations: 1 },
    { day: 'Fri', samples: 5, violations: 0 },
    { day: 'Sat', samples: 0, violations: 0 },
    { day: 'Sun', samples: 7, violations: 1 },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Essential metrics only */}
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
        {metrics.map((item, index) => (
          <div
            key={index}
            className="hover-box bg-glass dark:bg-glass backdrop-blur-md border border-gray-600 dark:border-gray-500 rounded-lg shadow-md p-4 text-center transition-all"
          >
            <h3 className="text-xs sm:text-sm text-gray-400 uppercase tracking-wide mb-1">
              {item.label}
            </h3>
            <p className="text-xl font-semibold text-neon">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Weekly breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
        {weekData.map(({ day, samples, violations }) => (
          <div
            key={day}
            className="hover-box bg-glass dark:bg-glass backdrop-blur-md border border-gray-600 dark:border-gray-500 rounded-lg p-4 shadow-md text-center"
          >
            <h3 className="text-sm font-bold text-neon mb-2">{day}</h3>
            <p className="text-sm text-gray-400">Samples: {samples}</p>
            <p
              className={`text-sm font-medium ${
                violations > 0 ? 'text-red-500' : 'text-green-400'
              }`}
            >
              Violations: {violations}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default MetricsPanel;
import React, { useRef } from 'react';
import { Line } from 'react-chartjs-2';
import html2canvas from 'html2canvas';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  annotationPlugin
);

function ChartDisplay({ formData, samples, isDark }) {
  const chartRef = useRef(null);

  const ucl = parseFloat(formData.ucl);
  const lcl = parseFloat(formData.lcl);

  const mean =
    samples.length > 0
      ? samples.reduce((sum, val) => sum + val, 0) / samples.length
      : null;

  const pointColors = samples.map((val) => {
    if (!isNaN(ucl) && val > ucl) return 'red';
    if (!isNaN(lcl) && val < lcl) return 'orange';
    return isDark ? '#00d4b2' : '#3b82f6'; // Softer neon in dark
  });

  const pointRadius = samples.map((val) =>
    (!isNaN(ucl) && val > ucl) || (!isNaN(lcl) && val < lcl) ? 7 : 5
  );

  const neon = isDark ? '#00d4b2' : '#3b82f6';
  const bgColor = isDark ? 'rgba(0, 212, 178, 0.1)' : 'rgba(84, 146, 204, 0.1)';
  const gridColor = isDark ? '#1f1f1f' : '#ccc';
  const textColor = isDark ? '#aee0db' : '#333';

  const chartData = {
    labels: samples.map((_, i) => `Sample ${i + 1}`),
    datasets: [
      {
        label: 'X̄ Values',
        data: samples,
        borderColor: neon,
        backgroundColor: bgColor,
        pointBackgroundColor: pointColors,
        pointBorderColor: pointColors,
        pointRadius,
        pointHoverRadius: 8,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    animation: {
      duration: 500,
      easing: 'easeOutBounce',
    },
    plugins: {
      legend: {
        labels: {
          color: textColor,
          font: { family: 'Orbitron' },
        },
      },
      annotation: {
        annotations: {
          ...(isNaN(ucl)
            ? {}
            : {
                ucl: {
                  type: 'line',
                  yMin: ucl,
                  yMax: ucl,
                  borderColor: 'red',
                  borderWidth: 2,
                  label: {
                    content: 'UCL',
                    enabled: true,
                    position: 'end',
                    color: '#fff',
                    backgroundColor: 'red',
                    font: { family: 'Orbitron' },
                  },
                },
              }),
          ...(isNaN(lcl)
            ? {}
            : {
                lcl: {
                  type: 'line',
                  yMin: lcl,
                  yMax: lcl,
                  borderColor: 'orange',
                  borderWidth: 2,
                  label: {
                    content: 'LCL',
                    enabled: true,
                    position: 'end',
                    color: '#fff',
                    backgroundColor: 'orange',
                    font: { family: 'Orbitron' },
                  },
                },
              }),
          ...(isNaN(mean)
            ? {}
            : {
                meanLine: {
                  type: 'line',
                  yMin: mean,
                  yMax: mean,
                  borderColor: 'green',
                  borderWidth: 2,
                  label: {
                    content: 'Mean',
                    enabled: true,
                    position: 'start',
                    color: '#fff',
                    backgroundColor: 'green',
                    font: { family: 'Orbitron' },
                  },
                },
              }),
        },
      },
    },
    scales: {
      x: {
        ticks: { color: textColor },
        grid: { color: gridColor },
      },
      y: {
        beginAtZero: true,
        ticks: { color: textColor },
        grid: { color: gridColor },
      },
    },
  };

  const handleExport = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement('a');
      link.download = 'spc_chart.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <>
      <div
        ref={chartRef}
        className="bg-glass backdrop-blur-md border border-gray-700 dark:border-gray-600 rounded-lg shadow-lg p-6"
      >
        <h2 className="text-lg font-semibold mb-4 text-neon">X̄ Control Chart</h2>
        <Line data={chartData} options={chartOptions} />
      </div>
      <div className="flex justify-end mt-3">
        <button
          onClick={handleExport}
          className="bg-neon text-black font-semibold px-4 py-2 rounded shadow-md hover:scale-105 transition"
        >
          ⬇️ Download Chart
        </button>
      </div>
    </>
  );
}

export default ChartDisplay;
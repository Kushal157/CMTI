import { useState } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { toast } from 'react-hot-toast';
import { evaluateViolations } from '../utils/evaluateViolations';
import { generateOrUpdateReport } from '../utils/reportManager';

function DataEntryForm({ formData, setFormData, setSamples, setViolations }) {
  const [replaceMode, setReplaceMode] = useState(true);
  const [storedViolations, setStoredViolations] = useState([]);
  const [storedSamples, setStoredSamples] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const sampleInput = formData.sample;
    const sampleValues = sampleInput
      .split(',')
      .map((val) => parseFloat(val.trim()))
      .filter((num) => !isNaN(num));
    handleSamples(sampleValues);
    setFormData((prev) => ({ ...prev, sample: '' }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const extension = file.name.split('.').pop().toLowerCase();

    if (extension === 'csv') {
      Papa.parse(file, {
        complete: (result) => {
          const flat = result.data.flat().map((val) => parseFloat(val)).filter((v) => !isNaN(v));
          handleSamples(flat);
        },
      });
    } else if (extension === 'xlsx') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const raw = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        const flat = raw.flat().map((val) => parseFloat(val)).filter((v) => !isNaN(v));
        handleSamples(flat);
      };
      reader.readAsArrayBuffer(file);
    } else {
      toast.error('❌ Unsupported file format. Please upload a CSV or Excel (.xlsx) file.');
    }
  };

  const handleSamples = (newSamples) => {
    const mergedSamples = replaceMode ? newSamples : [...storedSamples, ...newSamples];
    const violations = evaluateViolations(newSamples, formData);
    const mergedViolations = replaceMode ? violations : [...storedViolations, ...violations];

    setSamples(mergedSamples);
    setViolations(mergedViolations);
    setStoredSamples(mergedSamples);
    setStoredViolations(mergedViolations);

    violations.forEach(({ sample, type, index }) => {
      toast.error(`⚠️ Sample ${index} (${sample}) – ${type}`);
    });

    generateOrUpdateReport({
      fileName: 'SPC_Report.xlsx',
      newBatch: violations,
      sampleCount: newSamples.length,
      chartType: formData.chartType,
      autoDownload: false,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-lg font-semibold text-neon mb-4 tracking-wide">🔧 SPC Input Panel</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { name: 'sample', label: 'Sample Values (comma-separated)', type: 'text' },
          { name: 'usl', label: 'Upper Specification Limit (Enter Correct USL)', type: 'number' },
          { name: 'lsl', label: 'Lower Specification Limit (Enter Correct LSL)', type: 'number' },
          { name: 'ucl', label: 'Upper Control Limit (Enter Correct UCL)', type: 'number' },
          { name: 'lcl', label: 'Lower Control Limit (Enter Correct LCL)', type: 'number' },
          { name: 'chartType', label: 'Chart Type (Select From Below)', type: 'select' }, // moved inside map
        ].map(({ name, label, type }) => (
          <div key={name} className="flex flex-col">
            <label htmlFor={name} className="mb-1 text-sm text-gray-40">{label}</label>
            {type === 'select' ? (
              <select
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="bg-black bg-opacity-10 text-neon px-8 py-2 border border-neon rounded focus:outline-none"
              >
                <option value="X-R">X-R Chart</option>
                <option value="P">P Chart</option>
              </select>
            ) : (
              <input
                type={type}
                id={name}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={label}
                className="bg-black bg-opacity-10 text-neon placeholder-gray-500 px-4 py-2 border border-neon rounded focus:outline-none focus:ring-2 focus:ring-neon"
              />
            )}
            {name === 'sample' && formData.sample && (
              <p className="text-xs text-gray-500 mt-1">
                Parsed: {formData.sample.split(',').map((v) => v.trim()).filter(Boolean).join(', ')}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 items-center mt-4">
        <label className="flex items-center space-x-2 text-sm text-gray-30">
          <input
            type="checkbox"
            checked={replaceMode}
            onChange={() => setReplaceMode(!replaceMode)}
          />
          <span>Replace previous samples</span>
        </label>

        <input
          type="file"
          accept=".csv,.xlsx"
          onChange={handleFileUpload}
          className="text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-neon file:text-black hover:file:bg-teal-400"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </div>
    </form>
  );
}

export default DataEntryForm;
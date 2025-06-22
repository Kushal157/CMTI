export default function FooterControls({ setSamples, setFormData, setViolations }) {
  const reset = () => {
    setSamples([]);
    setViolations([]);
    setFormData({
      sample: '',
      usl: '',
      lsl: '',
      ucl: '',
      lcl: '',
      chartType: 'X-R',
    });
  };

  return (
    <div className="flex justify-center my-10">
      <button
        onClick={reset}
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded shadow-md transition hover:scale-105"
      >
        🔄 Reset Dashboard
      </button>
    </div>
  );
}
import { useEffect } from 'react';
import './NovaSplash.css'; // contains animations for expandO and logoFade

export default function NovaSplash({ onFinish }) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onFinish(); // triggers dashboard reveal
    }, 2600); // sync with animation duration

    return () => clearTimeout(timeout);
  }, [onFinish]);

  return (
    <div className="nova-splash relative flex items-center justify-center h-screen bg-black text-white overflow-hidden">
      <h1 className="nova-logo text-6xl sm:text-8xl font-bold tracking-wider relative z-10">
        <span className="fade-letter">N</span>
        <span className="nova-o">O</span>
        <span className="fade-letter">VA&nbsp;SPC</span>
      </h1>

      {/* Optional black screen behind expanding O */}
      <div className="nova-portal absolute inset-0 z-0 bg-black" />
    </div>
  );
}
module.exports = {
  content: ['./src/**/*.{js,jsx}', './public/index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        futuristic: ['Poppins', 'sans-serif'], // Updated from Orbitron to Poppins
      },
      colors: {
        neon: '#00d4b2',        // Softer neon teal (dark mode)
        violetGlow: '#7c3aed',  // Violet accent (light mode)
        glass: 'rgba(255, 255, 255, 0.05)',
        cream: '#fdf6ed',       // Warm light mode background
        darkBase: '#0e0e10',    // Deep dark mode background
        mildNeon: '#aee0db',    // Dimmed text in dark
      },
    },
  },
  plugins: [],
};
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 24px 80px rgba(0, 0, 0, 0.35)',
      },
      colors: {
        ink: '#07111f',
        midnight: '#050b14',
        slateGlow: '#9fb1cc',
        skyPulse: '#76c7ff',
        skyStrong: '#4ea6ff',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f8f7ff',
          100: '#eee9ff',
          200: '#dbccff',
          300: '#bf9cff',
          400: '#a96dff',
          500: '#9143ff',
          600: '#7d22f0',
          700: '#6918cf',
          800: '#5717a6',
          900: '#491586',
        },
        neon: {
          pink: '#ff4fd8',
          coral: '#ff7a59',
          mint: '#58f0c6',
          sky: '#5ad7ff',
          lemon: '#f9ff7a',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,0.08), 0 24px 80px rgba(145,67,255,0.28)',
        card: '0 20px 60px rgba(8, 15, 40, 0.35)',
      },
      backgroundImage: {
        'hero-neon':
          'radial-gradient(circle at top left, rgba(255,79,216,0.30), transparent 28%), radial-gradient(circle at 85% 15%, rgba(90,215,255,0.26), transparent 24%), radial-gradient(circle at 20% 90%, rgba(88,240,198,0.18), transparent 30%), linear-gradient(135deg, #0f1024 0%, #13183b 45%, #1b1240 100%)',
      },
      keyframes: {
        float: {
          '0%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-18px) scale(1.03)' },
          '100%': { transform: 'translateY(0px) scale(1)' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(12px, -8px) scale(1.05)' },
          '66%': { transform: 'translate(-8px, 12px) scale(0.98)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        rotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'blob-slow': 'blob 10s ease-in-out infinite',
        'blob-fast': 'blob 7s ease-in-out infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in': 'slideIn 0.6s ease-out',
        'fade-in': 'fadeIn 0.8s ease-out',
        'rotate-slow': 'rotate 20s linear infinite',
        'bounce-gentle': 'bounceGentle 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

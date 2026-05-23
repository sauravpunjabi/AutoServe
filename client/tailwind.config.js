/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      colors: {
        bg: '#0a0a0a',
        card: '#111111',
        hover: '#161616',
        border: '#1e1e1e',
        accent: '#f97316',
      },
    },
  },
  plugins: [],
};

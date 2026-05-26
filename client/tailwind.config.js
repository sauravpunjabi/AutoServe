export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
      fontSize: {
        '2xs': '10px',
        xs: '11px',
        sm: '12px',
        base: '13px',
        lg: '14px',
        xl: '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      colors: {
        bg: '#080808',
        card: '#0f0f0f',
        hover: '#1a1a1a',
        elevated: '#141414',
        border: '#1f1f1f',
        accent: '#f97316',
      },
    },
  },
  plugins: [],
};

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        obsidian: '#0B0E14',
        panel:    '#0F1218',
        panel2:   '#13171F',
        ink:      '#fafafa',
        silver:   '#94A3B8',
        mute:     '#5B6473',
        teal:     '#10B981',
        tealDim:  '#0e7d5b',
        warn:     '#eab308',
        danger:   '#ef4444',
        info:     '#3b82f6',
        line:     'rgba(255,255,255,0.08)',
        line2:    'rgba(255,255,255,0.14)',
        /* legacy */
        bg:       '#0B0E14',
        card:     '#0F1218',
        elevated: '#13171F',
        accent:   '#10B981',
      },
      borderRadius: {
        xs: '2px',
      },
      boxShadow: {
        float: '0 1px 3px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)',
      },
      fontSize: {
        '2xs': '10px',
        xs:    '11px',
        sm:    '12px',
        base:  '13px',
        lg:    '14px',
        xl:    '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};

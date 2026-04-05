/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary:   '#7c3aed',
          secondary: '#e94560',
          dark:      '#13131f',
          black:     '#0d0d14',
          deeper:    '#080810',
          card:      '#13131f',
          border:    '#1f1f30',
          muted:     '#6b7280',
          light:     '#f5f5f5',
          pale:      '#1a1a28',
          surface:   '#0f0f1a',
        }
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'red':     '0 0 24px rgba(233, 69, 96, 0.2)',
        'red-sm':  '0 0 10px rgba(233, 69, 96, 0.12)',
        'blue':    '0 0 24px rgba(15, 52, 96, 0.4)',
        'card':    '0 4px 24px rgba(0, 0, 0, 0.3)',
        'card-lg': '0 8px 40px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'fade-up':    'fadeUp 0.5s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}

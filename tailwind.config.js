/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8B1E17',
          dark:    '#6D1611',
          light:   '#A8261E',
        },
        accent: {
          DEFAULT: '#D97706',
          dark:    '#B45309',
          light:   '#F59E0B',
        },
        cream: {
          DEFAULT: '#FBF9F5',
          dark:    '#F3EFE8',
        },
        'text-dark':  '#23120B',
        'text-muted': '#7C6B5E',
        border:       '#EFE8DF',
        'brand-dark': '#23120B',
        'olive':      '#3E5244',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
      boxShadow: {
        card:         '0 1px 4px rgba(35,18,11,0.06), 0 2px 8px rgba(35,18,11,0.06)',
        'card-hover': '0 4px 16px rgba(35,18,11,0.12), 0 8px 24px rgba(35,18,11,0.08)',
        drawer:       '-4px 0 24px rgba(35,18,11,0.12)',
      },
      borderRadius: {
        card: '14px',
      },
      animation: {
        'slide-in-right': 'slideInRight 0.3s cubic-bezier(0.4,0,0.2,1)',
        'fade-in':        'fadeIn 0.25s ease-out',
        'fade-up':        'fadeUp 0.45s ease-out both',
        'fade-up-delay':  'fadeUp 0.45s ease-out 0.15s both',
      },
      keyframes: {
        slideInRight: {
          from: { transform: 'translateX(100%)' },
          to:   { transform: 'translateX(0)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(22px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

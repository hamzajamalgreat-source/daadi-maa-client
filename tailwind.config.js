/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8B1A1A',
          dark:    '#6B1414',
          light:   '#A52A2A',
        },
        accent: {
          DEFAULT: '#D4A843',
          dark:    '#B8892A',
          light:   '#E8C060',
        },
        cream: {
          DEFAULT: '#FDF8F0',
          dark:    '#F5EDE0',
        },
        'text-dark':  '#2D1810',
        'text-muted': '#7A6B63',
        border:       '#E8DDD3',
        /* Brand dark — used as bg for Premium badge */
        'brand-dark': '#2D1810',
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
        card:         '0 2px 8px rgba(45,24,16,0.08)',
        'card-hover': '0 8px 24px rgba(45,24,16,0.14)',
        drawer:       '-4px 0 24px rgba(45,24,16,0.12)',
        logo:         '0 4px 20px rgba(139,26,26,0.35)',
      },
      borderRadius: {
        card: '12px',
      },
      animation: {
        /* Logo — gentle continuous rotation */
        'logo-spin':   'logoSpin 12s linear infinite',
        /* Logo — slow swirl on hover (faster) */
        'logo-swirl':  'logoSpin 2s linear infinite',
        /* Entrance animations */
        'slide-in-right': 'slideInRight 0.3s cubic-bezier(0.4,0,0.2,1)',
        'fade-in':        'fadeIn 0.25s ease-out',
        'fade-up':        'fadeUp 0.4s ease-out',
        /* Spinner */
        'spin-brand':  'spin 1s linear infinite',
        /* Pulse glow on badge */
        'pulse-gold':  'pulseGold 2s ease-in-out infinite',
      },
      keyframes: {
        logoSpin: {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        slideInRight: {
          from: { transform: 'translateX(100%)' },
          to:   { transform: 'translateX(0)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGold: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(212,168,67,0.5)' },
          '50%':     { boxShadow: '0 0 0 8px rgba(212,168,67,0)' },
        },
      },
    },
  },
  plugins: [],
};

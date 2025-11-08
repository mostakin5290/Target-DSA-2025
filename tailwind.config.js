/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'background': 'var(--background)',
        'card': 'var(--card)',
        'card-secondary': 'var(--card-secondary)',
        'text-main': 'var(--text-main)',
        'text-secondary': 'var(--text-secondary)',
        'border': 'var(--border)',
        'accent': 'var(--accent)',
        'accent-hover': 'var(--accent-hover)',
        'accent-light': 'var(--accent-light)',
        
        'difficulty-easy': '#2ea043',
        'difficulty-medium': '#f0b429',
        'difficulty-hard': '#f85149',
        'difficulty-easy-bg': 'rgba(46, 160, 67, 0.15)',
        'difficulty-medium-bg': 'rgba(240, 180, 41, 0.15)',
        'difficulty-hard-bg': 'rgba(248, 81, 73, 0.15)',
      },
      animation: {
          'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
          'aurora': 'aurora 60s infinite',
      },
      keyframes: {
          fadeInUp: {
              '0%': { opacity: '0', transform: 'translateY(20px)' },
              '100%': { opacity: '1', transform: 'translateY(0)' },
          },
          aurora: {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
          }
      },
    }
  },
  plugins: [],
}

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
        
        'difficulty-easy': 'var(--difficulty-easy)',
        'difficulty-medium': 'var(--difficulty-medium)',
        'difficulty-hard': 'var(--difficulty-hard)',
        'difficulty-easy-bg': 'var(--difficulty-easy-bg)',
        'difficulty-medium-bg': 'var(--difficulty-medium-bg)',
        'difficulty-hard-bg': 'var(--difficulty-hard-bg)',
      },
      animation: {
          'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
      },
      keyframes: {
          fadeInUp: {
              '0%': { opacity: '0', transform: 'translateY(10px)' },
              '100%': { opacity: '1', transform: 'translateY(0)' },
          },
      },
    }
  },
  plugins: [],
}

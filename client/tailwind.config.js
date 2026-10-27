/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bhanjo: {
          crimson: '#E11D48',
          crimsonDark: '#BE123C',
          midnight: '#1B1F3B',
          gold: '#FFC83D',
          blush: '#FFE7EC',
          slate: '#5B6070',
          line: '#E5E7EB',
          page: '#FAFAFB',
          green: '#15803D',
          red: '#B42318',
          orange: '#E11D48',
          orangeDark: '#BE123C',
          orangeLight: '#FFE7EC',
          navy: '#1B1F3B',
          navyLight: '#2C3258',
          navyDark: '#121426',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'b2b': '0 2px 10px rgba(0,0,0,0.06)',
        'b2b-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        'modal': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
        '999': '999',
      }
    },
  },
  plugins: [],
}

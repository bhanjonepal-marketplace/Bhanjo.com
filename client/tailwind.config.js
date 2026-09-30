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
          orange: '#FF5722',
          orangeDark: '#E64A19',
          orangeLight: '#FFF3E0',
          navy: '#0F172A',
          navyLight: '#1E293B',
          navyDark: '#020617',
          gold: '#F59E0B',
          goldLight: '#FEF3C7',
          crimson: '#DC2626',
          crimsonDark: '#991B1B',
          teal: '#0D9488',
          himalayan: '#1E3A8A',
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

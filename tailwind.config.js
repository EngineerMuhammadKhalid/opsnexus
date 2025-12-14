
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#0A95FF',
        secondary: '#0074CC',
        'so-orange': '#F48024',
        dark: '#232629',
        darklighter: '#2D2D2D'
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

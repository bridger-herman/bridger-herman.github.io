/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    'assets/**/*.{js,html,jinja}',
    'templates/**/*.jinja'
  ],
  theme: {
    fontFamily: {
      'sans': 'Arial, Helvetica, sans-serif',
      'mono': ['"Fantasque Sans Mono"', 'ui-monospace', 'SFMono-Regular']
    },
    colors: {
      'transparent': colors.transparent,
      'current': 'currentColor',
      'white': '#ffffff',
      'black': '#000000',
      'gray': colors.gray,
      'zinc': colors.zinc,
      'sunset-orange': '#da8970',
      'sunset-blue': '#7986b4'
    }
  },
  plugins: [],
}


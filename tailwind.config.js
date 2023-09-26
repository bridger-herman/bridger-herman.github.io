/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    'assets/**/*.{js,html,jinja}',
    'templates/**/*.jinja'
  ],
  theme: {
    fontFamily: {
      'mono': ['"Fantasque Sans Mono"', 'ui-monospace', 'SFMono-Regular']
    },
    colors: {
      'transparent': 'transparent',
      'current': 'currentColor',
      'white': '#ffffff',
      'gray': colors.gray,
      'zinc': colors.zinc,
      'sunset-orange': '#da8970',
      'sunset-blue': '#7986b4'
    }
  },
  plugins: [],
}


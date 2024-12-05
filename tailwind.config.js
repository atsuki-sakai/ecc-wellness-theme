/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'tw-',
  content: [
    './layout/*.liquid',
    './templates/*.liquid',
    './sections/*.liquid',
    './snippets/*.liquid',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{html,js,jsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      transitionProperty: {
        'width': 'width',
        'height': 'height'
      },
    },
  },
  plugins: [],
}


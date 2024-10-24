/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,html}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito Sans', 'sans-serif'],
      },
      colors: {
        'container-gray': '#F5F6FA',
        'custom-green' : '#00a000',
        'custom-green-dark': '#2E9936',
        'custom-purple': '#9999cc',
      }
    },
  },
  plugins: [],
}


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './modules/**/*.{ts,tsx}',
  ],
  theme: {
    colors: {
      text2: 'rgba(0, 0, 0, 0.6)',
      text3: 'rgba(0, 0, 0, 0.4)',
      text4: 'rgba(0, 0, 0, 0.2)',
    },
  },
  plugins: [],
}

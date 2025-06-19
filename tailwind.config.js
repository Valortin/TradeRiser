/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#21BF73', // Robinhood-inspired green
        secondary: '#1F2937', // Dark background
        accent: '#3B82F6', // Blue for buttons
      },
    },
  },
  plugins: [],
};
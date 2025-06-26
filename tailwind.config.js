/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,ts,jsx,tsx}",                 // still needed for root-level App
    "./src/**/*.{js,ts,jsx,tsx}"             // 👈 this covers all files in your new src/ folder
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
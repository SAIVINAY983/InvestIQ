/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0A1128', // Deep patriotic navy (Trust/Security)
        surface: '#162347', // Soft warm navy for cards
        primary: '#4361EE', // Humanized royal blue (Action/Confidence)
        secondary: '#E63946', // Humanized soft crimson (Energy/Patriotism)
        accent: '#F4A261', // Warm gold/saffron (Wealth/Human warmth)
        danger: '#EF476F',
        warning: '#FFD166'
      }
    },
  },
  plugins: [],
}

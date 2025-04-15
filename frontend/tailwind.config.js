/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#059669",         // Emerald-600
        "primary-dark": "#047857",  // Emerald-700
        secondary: "#0D9488",       // Teal-600
        "secondary-dark": "#0F766E",// Teal-700
        dark: "#1F2937",            // Gray-800
        light: "#F9FAFB",           // Gray-50
        danger: "#EF4444",          // Red-500
        warning: "#F59E0B",         // Amber-500
        success: "#10B981",         // Green-500
        info: "#3B82F6",            // Blue-500
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
      }
    },
  },
  plugins: [],
}

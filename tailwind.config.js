/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('nativewind/preset')],
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#8B5CF6",
        success: "#6EE7B7",
        alert: "#FB7185",
        secondary: "#60A5FA",
        accent: "#FCA5A5",
        warning: "#FBBF24",
        background: "#F9FAFB",
        textPrimary: "#1F2937",
        textSecondary: "#6B7280",
        alert: "#FB7185",
        success: "#6EE7B7",
        secondary: "#60A5FA",
      },
    },
  },
  plugins: [],
};

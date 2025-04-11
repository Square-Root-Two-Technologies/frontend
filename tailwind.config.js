// FILE: tailwind.config.js
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // --- Option 1: Warmer Primary (e.g., Terracotta/Warm Red or Deep Teal) ---
        // primary: '#B95C50', // Terracotta/Warm Red
        "primary": "#0D9488", // Deep Teal (still slightly cool but richer than default blue)
        // --- Option 2: Keep a Blue, but maybe a richer/warmer shade ---
        // primary: '#312E81', // Indigo-700 (slightly warmer blue)

        "accent": "#F59E0B", // Amber-500 (Warm accent)
        // Or maybe a Rose accent:
        // accent: '#E11D48', // Rose-600

        // Use warmer grays like 'stone' or 'zinc' or 'neutral'
        "neutral": "#57534E", // stone-600 (Warmer dark gray for text)
        "secondary": "#A8A29E", // stone-400 (Warmer medium gray for subtle text)

        // Warmer background tones
        "background": "#FEFBF6", // Off-white / very light cream/beige
        "dark": "#000000", // stone-800 (Warm dark background)

        // Keep error/success distinct, maybe slightly muted
        "error": "#E11D48", // Rose-600 (Vibrant but fits warmer tones)
        "success": "#16A34A", // Green-600 (Standard green)

        // You might need specific shades for dark mode elements if 'dark' isn't enough
        "dark-card": "#3F3F46", // zinc-700 Example for card background in dark mode
        "dark-subtle": "#A1A1AA", // zinc-400 Example for subtle text in dark mode
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      spacing: {
        18: "4.5rem",
      },
      boxShadow: {
        "soft": "0 4px 12px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.05)",
        "soft-lg":
          "0 10px 20px rgba(0, 0, 0, 0.08), 0 4px 8px rgba(0, 0, 0, 0.06)",
      },
      borderRadius: {
        lg: "0.75rem",
      },
      transitionProperty: {
        height: "height",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};

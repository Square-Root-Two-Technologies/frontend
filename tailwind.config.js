const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Your existing colors
        "primary": "#0D9488",
        "accent": "#F59E0B",
        "neutral": "#57534E",
        "secondary": "#A8A29E",
        "background": "#FEFBF6",
        "dark": "#000000", // Consider a slightly off-black like #111827 or #1F2937 for better depth
        "error": "#E11D48", // Keep existing or adjust (e.g., #DC2626)
        "success": "#16A34A",
        "dark-card": "#1F2937", // Example dark card bg
        "dark-subtle": "#9CA3AF", // Example dark subtle text

        // --- UI Improvement Start: Add complementary error colors ---
        "error-light": "#FEF2F2", // For light backgrounds on errors (bg-red-50)
        "error-dark": "#991B1B", // For dark text on light error backgrounds (text-red-700)
        "error-border": "#F87171", // For borders (border-red-400)
        "error-ring": "#FCA5A5", // For focus rings (ring-red-300)
        // --- UI Improvement End ---
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
      // --- UI Improvement Start: Add ring color utility for error ---
      ringColor: ({ theme }) => ({
        ...theme("colors"), // Keep existing colors
        DEFAULT: theme("colors.blue.500", "#3B82F6"), // Default ring color
        error: theme("colors.error", "#E11D48"), // Add error ring color
      }),
      borderColor: ({ theme }) => ({
        // Ensure error border color is available
        ...theme("colors"),
        DEFAULT: theme("colors.gray.200", "#E5E7EB"),
        error: theme("colors.error", "#E11D48"), // Use your error color
      }),
      // --- UI Improvement End ---
    },
  },
  darkMode: "class", // Ensure dark mode is enabled
  plugins: [
    require("@tailwindcss/typography"), // Add if not already present for prose styling
    require("@tailwindcss/forms"), // Add if not already present for form styling resets
  ],
};

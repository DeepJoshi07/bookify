/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        display: ["Fraunces", "Georgia", "serif"],
      },
      colors: {
        paper: {
          50: "#faf8f5",
          100: "#f3efe8",
          200: "#e8dfd2",
        },
        ink: {
          700: "#2d3748",
          800: "#1a202c",
          900: "#0f1419",
        },
        accent: {
          DEFAULT: "#c45c3e",
          dark: "#a34a30",
        },
      },
      boxShadow: {
        card: "0 4px 24px -4px rgb(0 0 0 / 0.08), 0 2px 8px -2px rgb(0 0 0 / 0.06)",
        "card-dark": "0 4px 24px -4px rgb(0 0 0 / 0.35), 0 2px 8px -2px rgb(0 0 0 / 0.2)",
      },
    },
  },
  plugins: [],
};

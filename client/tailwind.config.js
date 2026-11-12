/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--color-bg)",
        surface: "var(--color-surface)",
        elevated: "var(--color-elevated)",
        paper: "var(--color-text)",
        muted: "var(--color-muted)",
        accent: "var(--color-accent)"
      },
      fontFamily: {
        display: ["Anton", "Impact", "sans-serif"],
        body: ["Manrope", "Inter", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 42px rgba(227, 43, 60, .18)"
      }
    }
  },
  plugins: []
};

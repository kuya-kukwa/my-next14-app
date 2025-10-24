/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "#e50914",
        dark: "#0a0a0a",
      },
      backgroundImage: {
        "section-1": "linear-gradient(135deg, #0a0a0a, #1a1a1a)",
        "section-2": "linear-gradient(135deg, #1a1a1a, #0f0f0f)",
        "section-3": "linear-gradient(135deg, #0f0f0f, #1a1a1a)",
        "section-4": "linear-gradient(135deg, #1a1a1a, #0a0a0a)",
      },
    },
  },
  plugins: [],
};

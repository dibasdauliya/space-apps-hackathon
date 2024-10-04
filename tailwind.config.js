/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sixtyfour: ['"Sixtyfour Convergence"', "sans-serif"],
      },
      backgroundImage: {
        "space-vibe":
          "linear-gradient(90deg, #1e3a8a, #3b82f6, #9333ea, #f43f5e)",
      },
    },
  },
  plugins: [],
};

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
      keyframes: {
        parabolicFlight: {
          "0%": { transform: "translate(0, 0)" },
          "100%": { transform: "translate(100vw, -80vh)" },
        },
        cometFlight: {
          "0%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(10px, 10px)" },
          "100%": { transform: "translate(0, 0)" },
        },
        rotate3D: {
          "0%": { transform: "rotate3d(1, 1, 0, 0deg)" },
          "100%": { transform: "rotate3d(1, 1, 0, 360deg)" },
        },
      },
      animation: {
        parabolicFlight:
          "parabolicFlight 3s cubic-bezier(0.42, 0, 0.58, 1) infinite",
        cometFlight: "cometFlight 5s ease-in-out infinite",
        rotate3D: "rotate3D 10s linear infinite",
      },
    },
  },
  plugins: [],
};

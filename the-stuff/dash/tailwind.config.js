/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        fadeUp: {
          "0%": {
            transform: "translate(-50%, -50%) scale(0.98)",
          },
          "100%": {
            transform: "translate(-50%, -50%) scale(1)",
          },
        },
        fadeIn: {
          "0%": {
            opacity: 0,
          },
          "100%": {
            opacity: 1,
          },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        fadeIn: "fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

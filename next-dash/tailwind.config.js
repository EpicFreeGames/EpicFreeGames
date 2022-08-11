/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        max: "1200px",
        halfMax: "600px",
      },
    },
  },
  plugins: [],
};

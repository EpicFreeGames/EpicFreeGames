const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  future: { hoverOnlyWhenSupported: true },
  content: ["./src/pages/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      mono: [
        "Consolas",
        "Andale Mono WT",
        "Andale Mono",
        "Lucida Console",
        "Lucida Sans Typewriter",
        "DejaVu Sans Mono",
        "Bitstream Vera Sans Mono",
        "Liberation Mono",
        "Nimbus Mono L",
        "Monaco",
        "Courier New",
        "Courier",
        "monospace",
      ],
    },

    extend: {
      keyframes: {
        fadeIn: {
          "0%": {
            opacity: 0,
            transform: "translateY(2px)",
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0px)",
          },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        fadeIn: "fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant("safe-hover", ["@media (any-hover:hover)", "&:hover"]);
    }),
  ],
};

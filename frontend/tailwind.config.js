/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		colors: {
			gray: {
				100: "#fcfcfc",
				200: "#f8f8f8",
				300: "#f3f3f3",
				400: "#ededed",
				500: "#e8e8e8",
				600: "#e2e2e2",
				700: "#dbdbdb",
				800: "#c7c7c7",
				900: "#8f8f8f",
				1000: "#858585",
				1100: "#6f6f6f",
				1200: "#171717",
			},
			red: {
				100: "#fffcfc",
				200: "#fff8f7",
				300: "#fff0ee",
				400: "#ffe6e2",
				500: "#fdd8d3",
				600: "#fac7be",
				700: "#f3b0a2",
				800: "#ea9280",
				900: "#e54d2e",
				1000: "#db4324",
				1100: "#ca3214",
				1200: "#341711",
			},
		},
		borderRadius: {
			lg: "0.5rem",
			md: "calc(0.5rem - 2px)",
			sm: "calc(0.5rem - 4px)",
		},
	},
};

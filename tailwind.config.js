module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: {
      center: true,
      screens: {
        xl: "1530px",
        "2xl": "1520px",
      },
    },
    extend: {
      colors: {
        brand: {
          gold: "#BFA242",
          dark: "#353535",
          red: "#BFA242",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
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
  plugins: [ require("@tailwindcss/line-clamp"),],
};

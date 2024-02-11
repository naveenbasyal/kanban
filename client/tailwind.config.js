module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        purple: "#ebf1ff",
      },
      textColor: {
        purple: "#5a5b80",
        heading: "#0D0F43",
        faded: "#807c8d",
      },
      colors: {
        "dark-color": "#0D0F43",
        "purple-dark": "#bdd0ff",
        "gray-light": "#ced6e4",
      },
      boxShadow: {
        board: "0px 3px 16px 1px rgba(0, 0, 0, 0.04)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("daisyui"),
  ],
  darkMode: "class",
  daisyui: {
    themes: false,
  },
};

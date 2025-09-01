/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}"  
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5C4033",
        secondary: "#D2B48C",
        accent: "#F5DEB3",
        textPrimary: "#3E2723",
        textSecondary: "#8B7355",
        bgLight: "#FAF3E0",
        bgDark: "#3B2F2F",
        highlight: "#C65D32",
      },
    },
  },
  plugins: [],
};

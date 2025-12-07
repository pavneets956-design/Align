/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        space: {
          900: "#020109"
        },
        gold: {
          300: "#f0d78c"
        }
      }
    }
  },
  plugins: []
};

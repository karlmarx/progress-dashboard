/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          primary: "#0f0808",
          surface: "#111118",
          border: "#1a1a24",
        },
      },
    },
  },
  plugins: [],
};

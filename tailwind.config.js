/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/utils/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-orange": "#ff3f22",
        "brand-orange-light": "#ff6b47",
      },
      spacing: {
        safe: "1.5rem",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Desabilita reset global para não quebrar PDFs
  },
};

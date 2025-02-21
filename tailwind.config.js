/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    `./src/pages/**/*.{js,jsx,ts,tsx}`,
    `./src/components/**/*.{js,jsx,ts,tsx}`,
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E3A8A", // Deep blue for main elements
        secondary: "#A7F3D0", // Soft cyan for accents
        background: "#F3E8D3", // Warm beige for a clean look
        textPrimary: "#1E293B", // Darker grayish-blue for readability
        textSecondary: "#64748B", // Lighter gray-blue for subtitles

        black: "#1a1615",
        purple: "#4f186b",
        blue: "#3e4db4",
        magenta: "#91144e",
        red: "#ea1f25",
        brown: "#ac6d37",
        yellow: "#f1ca00",
        white: "#ecddbe"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 4px 10px rgba(0, 0, 0, 0.1)",
        strong: "0 6px 20px rgba(0, 0, 0, 0.15)",
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
    function({ addVariant }) {
      addVariant('no-cursor', '@media (hover: none)');
    }
  ],
};

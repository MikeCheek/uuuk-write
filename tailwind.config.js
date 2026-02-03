/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [`./src/pages/**/*.{js,jsx,ts,tsx}`, `./src/components/**/*.{js,jsx,ts,tsx}`],
  theme: {
    extend: {
      colors: {
        black: '#1a1615',
        purple: '#4f186b',
        blue: '#3e4db4',
        magenta: '#91144e',
        red: '#ea1f25',
        brown: '#ac6d37',
        darkBrown: '#5c3b1e', // Adjusted to complement the brown palette
        yellow: '#f1ca00',
        beige: '#ecddbe',

        redBrick: '#a3635e',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
        calligraph: ['Calligraffitti', 'cursive'],
        roboto: ['Roboto', 'sans-serif'],
        helvetica: ['Helvetica', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 4px 10px rgba(0, 0, 0, 0.1)',
        strong: '0 6px 20px rgba(0, 0, 0, 0.15)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translate(0, 10%)' },
          '100%': { opacity: '1' },
        },
        expandCircle: {
          '0%': {
            transform: 'scale(1)',
            opacity: '0.3',
          },
          '100%': {
            transform: 'scale(2)',
            opacity: '0',
          },
        },
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-out forwards',
        expandCircle: 'expandCircle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
    function ({ addVariant }) {
      addVariant('no-cursor', '@media (hover: none)');
    },
  ],
};


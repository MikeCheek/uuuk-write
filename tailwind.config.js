/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [`./src/pages/**/*.{js,jsx,ts,tsx}`, `./src/components/**/*.{js,jsx,ts,tsx}`],
  theme: {
    extend: {
      colors: {
        black: '#0b1122',
        blue: '#132140',
        red: '#ea1f25',
        brown: '#f97516',
        darkBrown: '#0a1226',
        yellow: '#ffcf66',
        beige: '#ececef',
        redBrick: '#253a68',
        mint: '#1bb57f',
        silver: '#b8c0cf',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        heading: ['Archivo Black', 'sans-serif'],
        calligraph: ['Calligraffitti', 'cursive'],
        roboto: ['Space Grotesk', 'sans-serif'],
        helvetica: ['Space Grotesk', 'sans-serif'],
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
        sparkFly: {
          '0%': { transform: 'translate(0,0) scale(1)', opacity: '0.9' },
          '60%': { opacity: '0.7' },
          '100%': { transform: 'translate(var(--tx), var(--ty)) scale(0.1)', opacity: '0' },
        },
        flameFly: {
          '0%': { transform: 'translate(0,0) scale(1) rotate(var(--rot))', opacity: '0.85' },
          '40%': { opacity: '0.9' },
          '100%': {
            transform: 'translate(var(--tx), var(--ty)) scale(0) rotate(calc(var(--rot) + 20deg))',
            opacity: '0',
          },
        },
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-out forwards',
        expandCircle: 'expandCircle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        sparkFly: 'sparkFly var(--dur) ease-out var(--delay) infinite',
        flameFly: 'flameFly var(--dur) ease-out var(--delay) infinite',
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


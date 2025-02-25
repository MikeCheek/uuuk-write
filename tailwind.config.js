/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    `./src/pages/**/*.{js,jsx,ts,tsx}`,
    `./src/components/**/*.{js,jsx,ts,tsx}`,
  ],
  theme: {
    extend: {
      colors: {
        black: "#1a1615",
        purple: "#4f186b",
        blue: "#3e4db4",
        magenta: "#91144e",
        red: "#ea1f25",
        brown: "#ac6d37",
        yellow: "#f1ca00",
        white: "#ecddbe",
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
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: "translate(0, 10%)" },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-out forwards',
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


// Below is one approach to using your palette effectively across a website. This strategy creates contrast, ensures readability, and directs attention to key areas:

// 1. Backgrounds
  // Main Content Area:
    // Use white (#ecddbe) as the primary background. Its light, warm tone keeps the site feeling open and inviting.
  // Header & Navigation:
    // Use purple (#4f186b) for the header. Its depth creates a strong brand presence while pairing nicely with white text.
  // Footer:
    // Consider blue (#3e4db4) for the footer background. It offers a cool, distinct contrast from the header and main section.
// 2. Text (Primary/Secondary)
  // Primary Text:
    // Use black (#1a1615) on light backgrounds (like the main white section) to ensure high readability.
  // Secondary Text:
    // For subtitles, captions, or less-emphasized information, try brown (#ac6d37). It complements the primary text without competing for attention.
  // Alternative Accent:
    // In areas where you want a touch of extra flair (e.g., hover states or links), magenta (#91144e) can be applied to give a distinctive, creative edge.
// 3. Call to Action (CTA)
  // CTA Buttons/Highlights:
    // Use red (#ea1f25) for call-to-action elements. Its vibrant tone naturally draws the user’s eye. Pair it with white text to keep the message clear and striking.
// 4. Other Accents & Interactive Elements
  // Highlights & Hovers:
    // Use yellow (#f1ca00) sparingly for interactive accents (like hover effects on buttons or links). It injects energy without overwhelming.
  // Additional Accent Uses:
    // If you need extra visual interest in graphics or icons, consider mixing in magenta (#91144e) and blue (#3e4db4). They add depth and variation while staying true to your palette.
    // This combination establishes a clear visual hierarchy: a bright, neutral main area for content, bold header and footer sections for branding, and focused, energetic CTAs to guide user interactions. Adjust saturation or contrast as needed to suit specific design elements and ensure accessibility throughout.

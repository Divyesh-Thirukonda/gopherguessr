/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
      animation: {
        'flash-red': 'flash-red 0.5s infinite',
      },
      keyframes: {
        'flash-red': {
          '0%, 100%': { borderColor: 'rgba(255, 0, 0, 0.25)' },
          '50%': { borderColor: 'rgba(255, 0, 0, 1)' },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

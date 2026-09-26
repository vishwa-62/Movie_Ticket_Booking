/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#fff1f2',
          100: '#ffe4e6',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          900: '#4c0519',
        },
        dark: {
          900: '#0b0e14',
          800: '#121722',
          700: '#1b2232',
          600: '#252e42',
          500: '#344059'
        }
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(225, 29, 72, 0.4)',
        'glow-lg': '0 0 40px -5px rgba(225, 29, 72, 0.6)',
      }
    },
  },
  plugins: [],
}

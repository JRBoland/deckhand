/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // ADD a keyframes section for the wobble animation
      keyframes: {
        wobble: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        }
      },
      // ADD an animation section to use the keyframes
      animation: {
        wobble: 'wobble 0.5s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}


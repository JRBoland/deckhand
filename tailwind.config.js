/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Neobrutalism + coss-inspired tokens
        surface: 'var(--color-surface)',
        ink: 'var(--color-ink)',
        mute: 'var(--color-mute)',
        primary: 'var(--color-primary)',
        'primary-ink': 'var(--color-primary-ink)',
        accent: 'var(--color-accent)',
        border: 'var(--color-border)',
        destructive: 'var(--color-destructive)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
      },
      borderWidth: {
        thick: '3px',
      },
      boxShadow: {
        // Neobrutalism: solid offset shadow
        'brutal': '4px 4px 0 var(--color-ink)',
        'brutal-sm': '2px 2px 0 var(--color-ink)',
        'brutal-lg': '6px 6px 0 var(--color-ink)',
        // Pressed state (shadow moves down-right)
        'brutal-press': '1px 1px 0 var(--color-ink)',
        // Lumen-style glow for focus
        'glow': '0 0 0 3px var(--color-accent), 0 0 12px rgba(198, 245, 85, 0.4)',
      },
      borderRadius: {
        'brutal': '0.5rem',
        'brutal-lg': '0.75rem',
      },
      keyframes: {
        wobble: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 2px var(--color-accent), 0 0 8px rgba(198, 245, 85, 0.3)' },
          '50%': { boxShadow: '0 0 0 4px var(--color-accent), 0 0 16px rgba(198, 245, 85, 0.5)' },
        },
      },
      animation: {
        wobble: 'wobble 0.5s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

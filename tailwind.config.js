/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Core palette — named intentionally, not by shade number
        canvas: '#0F1117',       // page background
        surface: '#1C1F28',      // card/panel surface
        border: '#272B36',       // subtle borders
        muted: '#3D4251',        // disabled / placeholder
        sage: {
          DEFAULT: '#7C9E8A',    // primary accent — dusty sage
          light: '#9DB8A8',
          dark: '#5E7E6B',
          dim: '#7C9E8A1A',      // sage at 10% opacity for backgrounds
        },
        ink: {
          DEFAULT: '#F7F6F3',    // primary text
          muted: '#9EA3B0',      // secondary text
          faint: '#5A5F6E',      // tertiary text
        },
      },
      fontFamily: {
        serif: ['Instrument Serif', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Custom scale for the display headline
        'display': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-sm': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 1.8s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
      backgroundImage: {
        'shimmer-gradient': 'linear-gradient(90deg, transparent 0%, rgba(124,158,138,0.06) 50%, transparent 100%)',
      },
    },
  },
  plugins: [],
}

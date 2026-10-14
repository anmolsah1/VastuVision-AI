/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors
        saffron: {
          50:  '#FFF8E7',
          100: '#FFEFC4',
          200: '#FFDB85',
          300: '#FFC547',
          400: '#FFB41A',
          500: '#C8860A',
          600: '#A06A00',
          700: '#7A5000',
          800: '#5A3A00',
          900: '#3D2700',
        },
        // Dark charcoal for backgrounds
        charcoal: {
          50:  '#F2F2F4',
          100: '#E5E5EA',
          200: '#CBCBD5',
          300: '#B0B0BF',
          400: '#8A8A9A',
          500: '#646478',
          600: '#4A4A5A',
          700: '#333342',
          800: '#1E1E2C',
          900: '#0F0F1A',
          950: '#080810',
        },
        // Deep blue accent
        indigo: {
          50:  '#EEF2FF',
          100: '#E0E7FF',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(200, 134, 10, 0)' },
          '50%': { boxShadow: '0 0 20px 4px rgba(200, 134, 10, 0.3)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'shimmer': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
      },
      boxShadow: {
        'card': '0 2px 20px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 8px 40px rgba(0, 0, 0, 0.4)',
        'glow-saffron': '0 0 20px rgba(200, 134, 10, 0.4)',
        'inner-subtle': 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      },
    },
  },
  plugins: [],
}

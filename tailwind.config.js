/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0)',
            boxShadow: '0 20px 50px -12px rgba(0,0,0,0.1)',
          },
          '50%': {
            transform: 'translateY(-10px)',
            boxShadow: '0 30px 70px -15px rgba(0,0,0,0.2)',
          },
        },
      },
      boxShadow: {
        'glass': '0 8px 32px -8px rgba(0,0,0,0.1)',
        'glass-hover': '0 16px 48px -12px rgba(0,0,0,0.15)',
        'card': '0 10px 40px -15px rgba(0,0,0,0.1)',
        'card-hover': '0 20px 60px -20px rgba(0,0,0,0.15)',
        'button': '0 4px 12px -2px rgba(66,191,245,0.2)',
        'button-hover': '0 8px 20px -4px rgba(66,191,245,0.3)',
      },
    },
  },
  plugins: [],
};
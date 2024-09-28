const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        'blockchain-green': '#00b894',
        'blockchain-black': '#1e272e',
        'blockchain-light': '#ecf0f1',
        'blockchain-accent': '#0984e3',
        'blockchain-secondary': '#2d3436',
        'blockchain-bg-dark': '#0c1821',
        'blockchain-bg-accent': '#1b3a4b',
      },
      fontFamily: {
        sans: ['Rajdhani', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, var(--blockchain-accent), var(--blockchain-green))',
      },
      boxShadow: {
        'subtle': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'strong': '0 10px 20px rgba(0, 0, 0, 0.2)',
      },
      transitionProperty: {
        'smooth': 'all',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.25, 0.8, 0.25, 1)',
      },
      backdropFilter: {
        'blur': 'blur(8px)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      },
    },
  },
  variants: {
    extend: {
      opacity: ['hover', 'group-hover'],
      transform: ['hover', 'group-hover'],
      scale: ['hover', 'group-hover'],
      translate: ['hover', 'group-hover'],
      backdropFilter: ['hover'],
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
};
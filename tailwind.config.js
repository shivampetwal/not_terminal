module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        'accent-primary': 'var(--accent-primary)', // Allows usage of CSS variables
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        'fira-code': ['"Fira Code"', 'monospace'],
        'source-code-pro': ['"Source Code Pro"', 'monospace'],
      },
      backgroundImage: {
        /* Updated gradient-dark to desired gradient */
        'gradient-dark': 'linear-gradient(to right top, #051937, #004d7a, #008793, #00bf72, #a8eb12)',
        'gradient-light': 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
        'solid-black': '#000000',
        'solid-white': '#ffffff',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};

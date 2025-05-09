module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3490dc',
          dark: '#2779bd',
          light: '#6cb2eb',
        },
        secondary: {
          DEFAULT: '#ffed4a',
          dark: '#e3b505',
          light: '#fff382',
        },
        danger: {
          DEFAULT: '#e3342f',
          dark: '#cc1f1a',
          light: '#ef5753',
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
} 
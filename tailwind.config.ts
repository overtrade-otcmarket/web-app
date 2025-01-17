import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      backgroundColor: {
        primary: '#341CFF',
        gray: 'rgba(0, 0, 0, 0.19)',
        'blue-200': '#f2f6ff',
        'blue-300': '#d6e1ff',
        'blue-400': '#9eb7fe',
        'blue-500': '#341cff',
      },
      borderColor: {
        stroke: '#D6E1FF',
        divider: '#D6E1FF',
        focus: '#341CFF',
      },
      colors: {
        primary: '#1D1754',
        secondary: '#798AD0',
        success: '#19AD41',
        error: '#E24E59',
        'blue-500': '#341cff',
      },
      fontFamily: {
        montserrat: ['var(--font-montserrat)'],
      },
    },
  },
  plugins: [],
};
export default config;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    colors: {
      main: '#FCFC03',
      white: '#FFFFFF',
      black: '#333333',
    },
    screens: {
      xs: '0px',
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
    },
    fontFamily: {
      cpl: ['ChakraPetch-Light'],
      otb: ['Orbitron-Black'],
      otr: ['Orbitron-Regular'],
      otsb: ['Orbitron-SemiBold'],
    },
  },
  plugins: [],
}

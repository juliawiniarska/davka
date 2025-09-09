/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        coffeeDark : '#2d2214',
        coffeeTan  : '#c7a87a',
        coffeeBeige: '#f4e6c9',
        coffeeGreen: '#3d5a40',
      },
      fontFamily: {
      poppins: ['Poppins', 'sans-serif'],
      londrina: ['Londrina Shadow', 'serif'],   

     }
    },
  },
  plugins: [],
}

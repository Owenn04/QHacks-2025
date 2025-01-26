/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      screens: {
         mobile: { max: '767px' },
         desktop: { min: '768px' },
        },
      // minHeight: {
      //   screen: '896px',
      // },
      // width: {
      //   screen: '414px',
      // },
      extend: {
        colors: {
          orange: {
            400: '#FF9F43'
          },
          offwhite: '#FAFAFA'
        }
      }
    },
    plugins: [],
  }
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lcph: {
          primary: {
            DEFAULT: '#004321', // Forest Green
            light: '#0d5c32',
            dark: '#002914',
            surface: '#e6f3eb',
          },
          secondary: {
            DEFAULT: '#3448de', // Deep Water Blue
            light: '#5064f8',
            dark: '#152dc9',
          },
          tertiary: {
            DEFAULT: '#543012', // Earth Brown
            light: '#6f4626',
            dark: '#301400',
          },
          accent: {
            DEFAULT: '#e5a93b', // Sun Warm Accent
          },
          bg: '#f8f9ff',
          surface: '#ffffff',
          dark: '#0d1c2f',
          muted: '#404941',
          border: '#e2e8f0',
        }
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        body: ['Open Sans', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(13, 28, 47, 0.06)',
        'card': '0 10px 30px -5px rgba(0, 67, 33, 0.08)',
        'lift': '0 20px 40px -10px rgba(0, 67, 33, 0.12)',
      },
      borderRadius: {
        'lcph': '8px',
      }
    },
  },
  plugins: [],
}

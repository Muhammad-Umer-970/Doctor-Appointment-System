/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        navy: { DEFAULT: '#060e1f', mid: '#0b1a35', light: '#0f2347' },
      },
      boxShadow: {
        blue: '0 8px 24px rgba(37,99,235,.25)',
        teal: '0 8px 24px rgba(13,148,136,.25)',
      },
      animation: {
        'spin-fast': 'spin .6s linear infinite',
      },
    },
  },
  plugins: [],
};

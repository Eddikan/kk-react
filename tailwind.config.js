/** @type {import('tailwindcss').Config} */
export default {
  prefix: 'tw-',
  corePlugins: {
    preflight: false, // Disable Tailwind's reset styles
  },
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
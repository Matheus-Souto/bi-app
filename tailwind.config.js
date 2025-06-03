/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['var(--font-inter)'],
        jetbrains: ['var(--font-jetbrains-mono)'],
      },
      colors: {
        'primary-blue': '#2563eb',
        'primary-blue-dark': '#1d4ed8',
        'secondary-gray': '#64748b',
        'background-light': '#f8fafc',
        'text-dark': '#1e293b',
        'text-light': '#64748b',
        'border-color': '#e2e8f0',
        'success-green': '#10b981',
      },
    },
  },
  plugins: [],
};

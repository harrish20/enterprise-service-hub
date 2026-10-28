/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        tarq: {
          dark: '#0d1117',
          card: '#161b22',
          cardHover: '#1c2128',
          border: '#30363d',
          accent: '#38bdf8',
          purple: '#8b5cf6',
          cyan: '#06b6d4',
          orange: '#f97316',
          green: '#22c55e',
          red: '#ef4444'
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 25px rgba(6, 182, 212, 0.35)',
        'glow-purple': '0 0 25px rgba(139, 92, 246, 0.35)',
        'glow-blue': '0 0 25px rgba(56, 189, 248, 0.35)'
      }
    },
  },
  plugins: [],
}


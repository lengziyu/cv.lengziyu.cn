/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#151719',
        slate: '#667085',
        line: '#E7E9EE',
        paper: '#FFFFFF',
        'paper-soft': '#FAFBFC',
        accent: '#0F172A',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Avenir Next"', '"Segoe UI"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', '"SFMono-Regular"', 'monospace'],
      },
      boxShadow: {
        panel: '0 1px 2px rgba(15, 23, 42, 0.08), 0 12px 30px rgba(15, 23, 42, 0.05)',
      },
    },
  },
  plugins: [],
}

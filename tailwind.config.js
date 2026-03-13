/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bitcoin: '#F7931A',
        'bitcoin-dark': '#C87000',
        opnet: '#FF6B35',
        'bg-dark': '#0A0B0D',
        'bg-card': '#111318',
        'bg-surface': '#161B22',
        'border-subtle': '#21262D',
        'text-muted': '#8B949E',
        'text-dim': '#6E7681',
        success: '#3FB950',
        warning: '#D29922',
        error: '#F85149',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(247,147,26,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(247,147,26,0.03) 1px, transparent 1px)',
        'hero-glow': 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(247,147,26,0.15), transparent)',
        'card-glow': 'radial-gradient(ellipse 100% 100% at 50% 0%, rgba(247,147,26,0.05), transparent)',
      },
      backgroundSize: {
        grid: '40px 40px',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 6s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          from: { boxShadow: '0 0 20px rgba(247,147,26,0.3)' },
          to: { boxShadow: '0 0 40px rgba(247,147,26,0.6)' },
        },
      },
    },
  },
  plugins: [],
}

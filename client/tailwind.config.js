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
        flow: {
          bg: '#101323',
          card: '#1B2035',
          cardHover: '#222944',
          accent: '#8B5CF6',
          accentHover: '#7C3AED',
          accentLight: 'rgba(139, 92, 246, 0.15)',
          income: '#42E8B4',
          incomeLight: 'rgba(66, 232, 180, 0.15)',
          expense: '#FF718B',
          expenseLight: 'rgba(255, 113, 139, 0.15)',
          text: '#F5F6FF',
          muted: '#9299B3',
          border: '#262D4A',
          input: '#15192C',
        },
        light: {
          bg: '#F8FAFC',
          card: '#FFFFFF',
          cardHover: '#F1F5F9',
          text: '#0F172A',
          muted: '#64748B',
          border: '#E2E8F0',
          input: '#F8FAFC',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'panel': '16px',
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.25)',
        'elevated': '0 10px 30px -5px rgba(0, 0, 0, 0.35)',
        'glow-purple': '0 0 25px -5px rgba(139, 92, 246, 0.3)',
      }
    },
  },
  plugins: [],
}

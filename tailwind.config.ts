import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        card: '0 1px 4px 0 rgba(0,0,0,0.06), 0 1px 2px 0 rgba(0,0,0,0.04)',
        'card-hover': '0 6px 20px -4px rgba(124,58,237,0.14), 0 2px 6px -2px rgba(0,0,0,0.06)',
        'card-selected': '0 0 0 2px #7C3AED',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
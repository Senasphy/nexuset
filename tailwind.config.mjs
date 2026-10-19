/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg-base)',
        foreground: 'var(--text-primary)',
        card: {
          DEFAULT: 'var(--bg-surface)',
          foreground: 'var(--text-primary)'
        },
        popover: {
          DEFAULT: 'var(--bg-surface)',
          foreground: 'var(--text-primary)'
        },
        primary: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)'
        },
        secondary: {
          DEFAULT: 'var(--bg-elevated)',
          foreground: 'var(--text-primary)'
        },
        muted: {
          DEFAULT: 'var(--bg-elevated)',
          foreground: 'var(--text-muted)'
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)'
        },
        ink: 'var(--text-primary)',
        destructive: {
          DEFAULT: 'var(--wrong)',
          foreground: '#ffffff'
        },
        custom: 'var(--border)',
        border: 'var(--border)',
        input: 'var(--border)',
        ring: 'var(--accent)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        accent: 'var(--shadow-accent)',
        retro: '4px 4px 0px #000000',
        'retro-sm': '2px 2px 0px #000000',
        'retro-lg': '6px 6px 0px #000000',
        'retro-dark': '4px 4px 0px #27272a',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        fredoka: ['var(--font-fredoka)', 'var(--font-sans)', 'sans-serif'],
        display: ['var(--font-fredoka)', 'var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      zIndex: {
        sticky: 'var(--z-sticky)',
        overlay: 'var(--z-overlay)',
        modal: 'var(--z-modal)',
        popover: 'var(--z-popover)',
      },
    }
  },
  plugins: [require("tailwindcss-animate")],
};

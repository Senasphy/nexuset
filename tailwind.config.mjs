/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
        'bg-card_general',
        'bg-card_science',
        'bg-card_maths',
        'bg-card_english',
        'bg-card_geography',
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
        card_general: "#F3C5C5",
        card_science: "#C0F1DC",
        card_maths : "#F9E1C0",
        card_english : "#F8B575", 
        card_geography:  "#D5D3FF",
  			popover: {
  				DEFAULT: 'var(--bg-surface)',
  				foreground: 'var(--text-primary)'
  			},
  			primary: {
  				DEFAULT: 'var(--accent)',
  				foreground: '#ffffff'
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
  				foreground: '#ffffff'
  			},
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
		screens:{
			md1: '430px',
			md2: '480px',
			lg1: '950px'
		
			
		},

    backgroundImage:{
      'new-bg':"url('/newBg.jpg')",
      'dark-bg':"url('/darkBg.jpg')",
      'darkDot-bg':"url('/darkDot.jpg')",
      'lightDot-bg':"url('/lightDot.jpg')",
      'greenGirl-bg':"url('/greenGirl.jpg')",
      'calm-bg': "url('/backgroundCalm.jpg')",
    }

  	}
  },
  plugins: [require("tailwindcss-animate")],
};

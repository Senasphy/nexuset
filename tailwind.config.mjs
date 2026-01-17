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
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
        card_general: "#F3C5C5",
        card_science: "#C0F1DC",
        card_maths : "#F9E1C0",
        card_english : "#F8B575", 
        card_geography:  "#D5D3FF",
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
        custom: 'hsl(var(--border))',
 			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
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

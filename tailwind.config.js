/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    screens: {
      xs: '480px',
      sm: '480px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        subjectSelector: 'var(--subject-selector)',
        subjectSelectorHover: 'var(--subject-selector-hover)',
        verbSelector: 'var(--verb-selector)',
        verbSelectorHover: 'var(--verb-selector-hover)',
        objectInput: 'var(--object-input)',
        objectInputHover: 'var(--object-input-hover)',
        categorySelector: 'var(--category-selector)',
        categorySelectorHover: 'var(--category-selector-hover)',
        privacySelector: 'var(--privacy-selector)',
        privacySelectorHover: 'var(--privacy-selector-hover)',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // LIFT Brand Colors (using CSS variables for consistency)
        brand: {
          pink: 'var(--brand-pink)',
          black: 'var(--brand-black)',
          white: 'var(--brand-white)',
          green: 'var(--brand-green)',
          teal: 'var(--brand-teal)',
          blue: 'var(--brand-blue)',
          orange: 'var(--brand-orange)',
          yellow: 'var(--brand-yellow)',
          purple: 'var(--brand-purple)',
          darkPurple: 'var(--brand-darkPurple)',
        },
        // Wizard/Step specific colors using CSS variables
        objectInput: 'var(--object-input)',
        verbSelector: 'var(--verb-selector)',
        subjectSelector: 'var(--subject-selector)',
        privacySelector: 'var(--privacy-selector)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      spacing: {
        'wizard-padding': '1.5rem',
      },
      fontSize: {
        'wizard-h2': '1.5rem',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--accordion-content-height, auto)' },
        },
        'accordion-up': {
          from: { height: 'var(--accordion-content-height, auto)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      fontFamily: {
        sans: ['Metropolis', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

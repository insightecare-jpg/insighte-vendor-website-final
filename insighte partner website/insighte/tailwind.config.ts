import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [
    require('@tailwindcss/typography'),
  ],
  theme: {
    extend: {
      typography: ({ theme }: any) => ({
        insighte: {
          css: {
            '--tw-prose-body': 'var(--color-text-primary)',
            '--tw-prose-headings': 'var(--color-text-primary)',
            '--tw-prose-lead': 'var(--color-text-secondary)',
            '--tw-prose-links': 'var(--color-accent)',
            '--tw-prose-bold': 'var(--color-text-primary)',
            '--tw-prose-quotes': 'var(--color-text-secondary)',
            '--tw-prose-quote-borders': 'var(--color-accent)',
            '--tw-prose-captions': 'var(--color-text-tertiary)',
            '--tw-prose-code': 'var(--color-text-primary)',
            '--tw-prose-pre-code': 'var(--color-text-primary)',
            '--tw-prose-pre-bg': 'rgba(255, 255, 255, 0.05)',
            maxWidth: '680px',
            fontSize: '17px',
            lineHeight: '1.75',
            p: { marginBottom: '1.5rem' },
            h2: { 
              fontSize: '22px', 
              fontWeight: '600', 
              marginTop: '2.5rem',
              marginBottom: '0.75rem',
              fontFamily: 'inherit',
              fontStyle: 'normal',
            },
            h3: { 
              fontSize: '18px', 
              fontWeight: '500', 
              marginTop: '2rem',
              marginBottom: '0.5rem',
              fontFamily: 'inherit',
              fontStyle: 'normal',
            },
            blockquote: {
              fontStyle: 'italic',
              borderLeftWidth: '3px',
              paddingLeft: '1.5rem',
              fontSize: '18px',
              fontWeight: '400',
              quotes: 'none',
            },
          },
        },
      }),
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          dark: "var(--color-primary-dark)",
          light: "var(--color-primary-light)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          light: "var(--color-accent-light)",
        },
        success: "var(--color-success)",
        danger: "var(--color-danger)",
        warning: "var(--color-warning)",
        surface: {
          1: "var(--color-surface-1)",
          2: "var(--color-surface-2)",
          3: "var(--color-surface-3)",
        },
        border: {
          DEFAULT: "var(--color-border)",
          strong: "var(--color-border-strong)",
        },
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          tertiary: "var(--color-text-tertiary)",
        },
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        float: "var(--shadow-float)",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
};

export default config;

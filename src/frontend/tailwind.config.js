import typography from "@tailwindcss/typography";
import containerQueries from "@tailwindcss/container-queries";
import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["index.html", "src/**/*.{js,ts,jsx,tsx,html,css}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "oklch(var(--border))",
        input: "oklch(var(--input))",
        ring: "oklch(var(--ring) / <alpha-value>)",
        background: "oklch(var(--background))",
        foreground: "oklch(var(--foreground))",
        primary: {
          DEFAULT: "oklch(var(--primary) / <alpha-value>)",
          foreground: "oklch(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary) / <alpha-value>)",
          foreground: "oklch(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive) / <alpha-value>)",
          foreground: "oklch(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "oklch(var(--muted) / <alpha-value>)",
          foreground: "oklch(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "oklch(var(--accent) / <alpha-value>)",
          foreground: "oklch(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "oklch(var(--popover))",
          foreground: "oklch(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "oklch(var(--card))",
          foreground: "oklch(var(--card-foreground))",
        },
        chart: {
          1: "oklch(var(--chart-1))",
          2: "oklch(var(--chart-2))",
          3: "oklch(var(--chart-3))",
          4: "oklch(var(--chart-4))",
          5: "oklch(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "oklch(var(--sidebar))",
          foreground: "oklch(var(--sidebar-foreground))",
          primary: "oklch(var(--sidebar-primary))",
          "primary-foreground": "oklch(var(--sidebar-primary-foreground))",
          accent: "oklch(var(--sidebar-accent))",
          "accent-foreground": "oklch(var(--sidebar-accent-foreground))",
          border: "oklch(var(--sidebar-border))",
          ring: "oklch(var(--sidebar-ring))",
        },
        sky: {
          DEFAULT: "oklch(var(--sky))",
          light: "oklch(var(--sky-light))",
          dark: "oklch(var(--sky-dark))",
        },
        gold: {
          DEFAULT: "oklch(var(--gold))",
          light: "oklch(var(--gold-light))",
        },
        cream: "oklch(var(--cream))",
        bpink: "oklch(var(--pink))",
        mint: "oklch(var(--mint))",
        lavender: "oklch(var(--lavender))",
        peach: "oklch(var(--peach))",
      },
      fontFamily: {
        heading: ["'Pacifico'", "cursive"],
        body: ["'Quicksand'", "sans-serif"],
        display: ["'Pacifico'", "cursive"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
        xl: "1.5rem",
        "2xl": "2rem",
        "3xl": "3rem",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0,0,0,0.05)",
        birthday: "0 12px 48px oklch(0.62 0.16 230 / 22%), 0 4px 16px oklch(0.62 0.16 230 / 12%), inset 0 1px 0 oklch(1 0 0 / 50%)",
        "birthday-lg": "0 20px 64px oklch(0.62 0.16 230 / 28%), 0 8px 24px oklch(0.62 0.16 230 / 16%), inset 0 1px 0 oklch(1 0 0 / 55%)",
        gold: "0 8px 32px oklch(0.82 0.18 80 / 35%), 0 2px 8px oklch(0.82 0.18 80 / 20%), inset 0 1px 0 oklch(1 0 0 / 40%)",
        soft: "0 4px 24px oklch(0.62 0.16 230 / 15%), 0 1px 4px oklch(0.18 0.04 230 / 8%)",
        float: "0 16px 40px oklch(0.62 0.16 230 / 20%), 0 4px 12px oklch(0.18 0.04 230 / 10%)",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [typography, containerQueries, animate],
};

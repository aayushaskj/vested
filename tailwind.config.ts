import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f7f8fa",
          100: "#eef0f4",
          200: "#d8dde5",
          300: "#b3bcca",
          400: "#7d8a9e",
          500: "#525e75",
          600: "#3a4459",
          700: "#2a3343",
          800: "#1c2230",
          900: "#10141d",
        },
        accent: {
          50: "#ecfdf6",
          100: "#d1fae8",
          200: "#a4f3d2",
          300: "#6be6b6",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', '"Inter"', "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        display: ['var(--font-inter)', '"Inter"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      typography: ({ theme }: any) => ({
        DEFAULT: {
          css: {
            "--tw-prose-body": theme("colors.ink.700"),
            "--tw-prose-headings": theme("colors.ink.900"),
            "--tw-prose-links": theme("colors.brand.700"),
            "--tw-prose-bold": theme("colors.ink.900"),
            "--tw-prose-quotes": theme("colors.ink.700"),
            "--tw-prose-quote-borders": theme("colors.accent.500"),
            "--tw-prose-code": theme("colors.ink.800"),
            maxWidth: "68ch",
            fontSize: "1.0625rem",
            lineHeight: "1.75",
            a: {
              textDecoration: "none",
              borderBottom: `1px solid ${theme("colors.brand.300")}`,
              "&:hover": { borderBottomColor: theme("colors.brand.600") },
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;

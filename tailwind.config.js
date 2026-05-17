/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    screens: {
      'xs': '480px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        primary: "#2563EB",
        "primary-hover": "#1D4ED8",
        "primary-light": "#DBEAFE",
        "primary-dark": "#1E3A5F",
        background: "#F8FAFC",
        surface: "#FFFFFF",
        "surface-muted": "#F1F5F9",
        "surface-hover": "#E2E8F0",
        "surface-border": "#E2E8F0",
        "on-surface": "#0F172A",
        "on-surface-muted": "#64748B",
        "on-surface-subtle": "#94A3B8",
        error: "#EF4444",
        "error-light": "#FEE2E2",
        success: "#10B981",
        "success-light": "#D1FAE5",
        warning: "#F59E0B",
        "warning-light": "#FEF3C7",
        premium: "#F59E0B",
        "premium-bg": "#FFFBEB",
        "dark-bg": "#0F172A",
        "dark-surface": "#1E293B",
        "dark-border": "#334155",
        "dark-on-surface": "#F1F5F9",
        "dark-muted": "#94A3B8",
      },
      borderRadius: {
        DEFAULT: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        full: "9999px"
      },
      spacing: {
        gutter: "1rem",
        "component-gap": "1rem",
        "sidebar-width": "240px",
        "editor-max-width": "800px",
        "container-padding": "1.5rem"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "monospace"],
        "cv-serif": ["Noto Serif", "serif"],
      },
      fontSize: {
        "2xs": ["10px", { lineHeight: "14px", fontWeight: "400" }],
        xs: ["12px", { lineHeight: "16px", fontWeight: "400" }],
        sm: ["14px", { lineHeight: "20px", fontWeight: "400" }],
        base: ["16px", { lineHeight: "24px", fontWeight: "400" }],
        lg: ["18px", { lineHeight: "28px", fontWeight: "500" }],
        xl: ["20px", { lineHeight: "28px", fontWeight: "600" }],
        "2xl": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "3xl": ["30px", { lineHeight: "38px", fontWeight: "700" }],
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.03)",
        DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.03)",
        md: "0 4px 12px -2px rgb(0 0 0 / 0.06)",
        lg: "0 8px 24px -4px rgb(0 0 0 / 0.06)",
        xl: "0 12px 32px -4px rgb(0 0 0 / 0.08)",
      }
    },
  },
  plugins: [],
};

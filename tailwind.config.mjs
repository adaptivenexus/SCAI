/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        "secondary-foreground": "var(--secondary-foreground)",
        "accent-primary": "var(--accent-primary)",
        "accent-secondary": "var(--accent-secondary)",
      },
      backgroundImage: {
        "primary-gradient": "var(--primary-gradient)",
        "primary-gradient-reverse": "var(--primary-gradient-reverse)",
        "secondary-gradient": "var(--secondary-gradient)",
      },
    },
  },
  plugins: [],
};

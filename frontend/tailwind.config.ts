import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                "primary": "#45cf17",
                "primary-dark": "#36a812",
                "background-light": "#f9fcf8",
                "background-dark": "#152111",
                "surface-light": "#ffffff",
                "surface-dark": "#1e2e19",
                "text-main": "#111b0e",
                "text-muted": "#60974e",
            },
            fontFamily: {
                "display": ["var(--font-inter)", "sans-serif"],
                "body": ["var(--font-inter)", "sans-serif"],
            },
            borderRadius: {
                "DEFAULT": "0.375rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "2xl": "1rem",
                "full": "9999px"
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                'glow': '0 0 15px rgba(69, 207, 23, 0.2)',
            }
        },
    },
    plugins: [],
};
export default config;

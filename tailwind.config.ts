import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        waveBounce: "waveBounce 1.5s infinite",
        "bounce-shake": "bounce-shake 0.5s ease-in-out",
        "fade-in": "fade-in 0.5s ease-in-out",
        "scale-up": "scale-up 0.5s ease-in-out",
        "slide-in": "slide-in 0.5s ease-in-out",
      },
      keyframes: {
        waveBounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "bounce-shake": {
          "0%, 100%": { transform: "translateY(0)" },
          "30%": { transform: "translateY(-10px)" },
          "50%": { transform: "translateX(5px)" },
          "70%": { transform: "translateX(-5px)" },
        },
        "scale-up": {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "slide-in": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;

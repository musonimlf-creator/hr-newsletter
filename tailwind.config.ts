import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F7EED7',
          100: '#E7DBEE',
          200: '#C2A2CB',
          300: '#8E4A90',
          400: '#6E3371',
          500: '#52275A',
          600: '#3E1841',
        },
        accent: {
          50: '#FFF9E5',
          100: '#FFEAA7',
          200: '#FFD058',
          300: '#FFC700',
          400: '#F9BC1C',
        },
      },
    },
  },
  plugins: [],
};
export default config;

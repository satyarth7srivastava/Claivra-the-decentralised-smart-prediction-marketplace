import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryBlue : '#333A56',
        line1 : '#E8E8E8',
        secBlack: '#383838',
        primaryBlack : '#171717',
        primaryWhite : '#f8f8f8',
        grey : '#989491',
        footer : '#DEE5FF',
        green : '#4BA15F',
        line2 : '#565656',
      },
    },
  },
  plugins: [],
} satisfies Config;
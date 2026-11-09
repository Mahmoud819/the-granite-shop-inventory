import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        stonework: {
          ink: "#242b29",
          moss: "#536c5c",
          clay: "#b36e4d",
          paper: "#f5f4f0",
        },
      },
    },
  },
  plugins: [],
};

export default config;
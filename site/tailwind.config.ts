import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FAFAF7",
        ink: "#1A1A18",
        "ink-soft": "#2C2C2A",
        "ink-muted": "#65645F",
        "ink-faint": "#95938B",
        line: "#E6E4DC",
        accent: {
          cobalt: "#2D4DEB",
          pink: "#FF3D8B",
          mustard: "#E5B53A",
          orange: "#FF6B35",
          lime: "#9BD43F"
        }
      },
      fontFamily: {
        sans: ["Space Grotesk", "system-ui", "sans-serif"],
        display: ["Editorial New", "Migra", "Playfair Display", "Georgia", "serif"]
      }
    }
  },
  plugins: []
};

export default config;

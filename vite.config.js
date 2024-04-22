import { defineConfig } from "vite";

export default defineConfig({
  base: "/portfolio/",
  build: {
    minify: "terser",
  },
});

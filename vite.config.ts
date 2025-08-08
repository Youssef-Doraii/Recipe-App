import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // use this line if deploying to GitHub Pages
  // base: "/Recipe-App/",
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";
import { existsSync } from "node:fs";

// Deploy base path: "/" for a custom domain, "/ASN/" for GitHub Pages project builds
const hasCustomDomain = existsSync(fileURLToPath(new URL("./public/CNAME", import.meta.url)));

// Vite config
export default defineConfig({
  root: ".",
  base: hasCustomDomain ? "/" : (process.env.GITHUB_ACTIONS ? "/ASN/" : "/"),
  plugins: [react(), tailwindcss()],

  // Dev server
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },

  // Import alias
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";
import { existsSync } from "node:fs";

// A `public/CNAME` file means GitHub Pages is serving this from a custom
// domain at the root (/) — without one, GitHub Actions builds serve from
// the project subpath (/ASN/) instead. Hardcoding one or the other breaks
// asset paths (blank white screen) the moment the deploy target changes,
// so this detects it instead of needing a manual flip at cutover time.
const hasCustomDomain = existsSync(fileURLToPath(new URL("./public/CNAME", import.meta.url)));

export default defineConfig({
  root: ".",
  base: hasCustomDomain ? "/" : (process.env.GITHUB_ACTIONS ? "/ASN/" : "/"),
  plugins: [react(), tailwindcss()],

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

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
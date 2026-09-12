import path from "node:path";
import { defineConfig } from "vite";

// public_html/ is the canonical source tree.
// This config serves it for local preview (npm run dev / npm run preview).
export default defineConfig({
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "public_html"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});

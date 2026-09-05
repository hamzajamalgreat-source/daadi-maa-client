import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": { target: "http://localhost:5000", changeOrigin: true },
      "/images": { target: "http://localhost:5000", changeOrigin: true },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    // FL8: Split vendor libraries into separate cached chunks.
    // Returning users only re-download app code, not vendor libs.
    rollupOptions: {
      output: {
        manualChunks: {
          // React core — almost never changes, cache aggressively
          vendor: ["react", "react-dom", "react-router-dom"],
          // UI utilities — separate so app changes dont bust this cache
          ui: ["lucide-react", "react-hot-toast"],
          // State management
          store: ["zustand"],
        },
      },
    },
  },
});

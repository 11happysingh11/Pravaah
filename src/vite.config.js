import { defineConfig } from "vite";

export default defineConfig({
  preview: {
    port: 10000,
    host: "0.0.0.0",
    allowedHosts: ["pravaah.onrender.com"]
  }
});

import { defineConfig } from "vite";

export default defineConfig({
  preview: {
    port: process.env.PORT || 10000,
    host: "0.0.0.0",
    allowedHosts: ["*"]
  }
});

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 3000;

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend (dist folder)
app.use(express.static(path.join(__dirname, "dist")));

// Example API route (dynamic part)
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from backend!" });
});

// Fallback to index.html (for SPA routes)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});

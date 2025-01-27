import express from "express";
import fs from "fs/promises"; 
import path from "path";
import { fileURLToPath } from "url";

const app = express();


// Helper to get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Endpoint to serve JSON data
app.get("/learning-data", async (req, res) => {
  const filePath = path.join(__dirname, "../data.json");

  try {
    const data = await fs.readFile(filePath, "utf8"); // Read file asynchronously
    res.status(200).json(JSON.parse(data)); // Send parsed JSON
  } catch (err) {
    console.error("Error reading JSON file:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default app;

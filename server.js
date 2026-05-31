import cors from "cors";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "analytics.json");
const app = express();

app.use(cors());
app.use(express.json());

function readData() {
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]");
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.post("/track", (req, res) => {
  const data = readData();
  data.push({ ...req.body, serverTime: new Date().toISOString() });
  writeData(data);
  res.json({ ok: true });
});

app.get("/analytics", (req, res) => {
  res.json(readData());
});

app.delete("/analytics", (req, res) => {
  writeData([]);
  res.json({ ok: true });
});

app.listen(3001, () => console.log("Analytics server running on http://localhost:3001"));

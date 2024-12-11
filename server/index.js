// vercel ready
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import Pg from "pg";
import * as dotenv from "dotenv";

const { Pool } = Pg;

// Load environment variables
dotenv.config({ path: "./.env" });

// Initialize Express app
const app = express();

// Middleware
const corsOptions = {
  origin: ["http://localhost:3000", "https://inorgo-blog.vercel.app"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

// PostgreSQL Pool Configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("connect", () => {
  console.log("Connected to the database");
});

pool.on("error", (err) => {
  console.error("Database connection error:", err);
  process.exit(1);
});

const testDatabaseConnection = async () => {
  try {
    await pool.query("SELECT NOW()");
    console.log("Database connection test successful");
  } catch (err) {
    console.error("Database connection test failed:", err);
  }
};

testDatabaseConnection();

// Helper function to format date as MM/DD/YYYY
const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, "0"); // Ensure leading zeros
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

// Fetch all journals
app.get("/journals", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, title, description, content, written_by, created_at, db_created_at FROM journals ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching journals:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch a single journal by ID
app.get("/journals/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT id, title, description, content, written_by, created_at FROM journals WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Journal not found" });
    }

    const journal = result.rows[0];
    journal.created_at = formatDate(new Date(journal.created_at)); // Format created_at
    res.json(journal);
  } catch (err) {
    console.error("Error fetching journal:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add a new journal
app.post("/journals", async (req, res) => {
  const { title, description, content, written_by, created_at } = req.body;

  if (!title || !description || !content || !written_by || !created_at) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO journals (title, description, content, written_by, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING id, title, description, content, written_by, created_at",
      [title, description, content, written_by, new Date(created_at)]
    );

    const journal = result.rows[0];
    journal.created_at = formatDate(new Date(journal.created_at)); // Format created_at
    res.status(201).json(journal);
  } catch (err) {
    console.error("Error adding journal:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for Vercel serverless
export default app;

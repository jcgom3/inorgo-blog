// import express from "express";
// import bodyParser from "body-parser";
// import cors from "cors";
// import Pg from "pg";
// import dotenv from "dotenv";

// const { Pool } = Pg;

// // Load environment variables
// dotenv.config();

// // Initialize Express app
// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // PostgreSQL Pool Configuration
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// // Helper function to format date as MM/DD/YYYY
// const formatDate = (date) => {
//   const day = String(date.getDate()).padStart(2, "0"); // Ensure leading zeros
//   const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
//   const year = date.getFullYear();
//   return `${month}/${day}/${year}`;
// };

// // Fetch all journals
// // app.get("/journals", async (req, res) => {
// //   try {
// //     const result = await pool.query(
// //       "SELECT id, title, description, content, written_by, created_at FROM journals ORDER BY created_at DESC"
// //     );

// //     // Format the created_at field for all rows
// //     const formattedRows = result.rows.map((row) => ({
// //       ...row,
// //       created_at: formatDate(new Date(row.created_at)), // Format created_at
// //     }));

// //     res.json(formattedRows);
// //   } catch (err) {
// //     console.error("Error fetching journals:", err);
// //     res.status(500).json({ error: "Internal Server Error" });
// //   }
// // });
// app.get("/journals", async (req, res) => {
//   try {
//     const result = await pool.query(
//       "SELECT id, title, description, content, written_by, created_at, db_created_at FROM journals ORDER BY created_at DESC"
//     );
//     res.json(result.rows);
//   } catch (err) {
//     console.error("Error fetching journals:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // Fetch a single journal by ID
// app.get("/journals/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     const result = await pool.query(
//       "SELECT id, title, description, content, written_by, created_at FROM journals WHERE id = $1",
//       [id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: "Journal not found" });
//     }

//     const journal = result.rows[0];
//     journal.created_at = formatDate(new Date(journal.created_at)); // Format created_at
//     res.json(journal);
//   } catch (err) {
//     console.error("Error fetching journal:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // Add a new journal
// app.post("/journals", async (req, res) => {
//   const { title, description, content, written_by, created_at } = req.body;

//   if (!title || !description || !content || !written_by || !created_at) {
//     return res.status(400).json({ error: "All fields are required" });
//   }

//   try {
//     const result = await pool.query(
//       "INSERT INTO journals (title, description, content, written_by, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING id, title, description, content, written_by, created_at",
//       [title, description, content, written_by, new Date(created_at)]
//     );

//     const journal = result.rows[0];
//     journal.created_at = formatDate(new Date(journal.created_at)); // Format created_at
//     res.status(201).json(journal);
//   } catch (err) {
//     console.error("Error adding journal:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

// vercel ready

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import Pg from "pg";
import dotenv from "dotenv";

const { Pool } = Pg;

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL Pool Configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

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

// Export the app for Vercel serverless
export default app;

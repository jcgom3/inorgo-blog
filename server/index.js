// vercel ready
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import Pg from "pg";
import * as dotenv from "dotenv";
import session from "express-session";

const { Pool } = Pg;

// Load environment variables
dotenv.config({ path: `./.env` });

// Initialize Express app
const app = express();

// Middleware
app.use((req, res, next) => {
  const currentTime = new Date().toLocaleString(); // ISO format for clear timestamp
  console.log(
    `Incoming Request Origin: ${
      req.headers.origin || "Unknown Origin"
    } Time: ${currentTime}`
  );
  next();
});

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://inorgo-blog.vercel.app",
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// PostgreSQL Pool Configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
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
      "SELECT id, title, description, content, email, written_by, created_at, db_created_at FROM journals ORDER BY created_at DESC"
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
// Add a new journal
app.post("/journals", async (req, res) => {
  const {
    title,
    description,
    content,
    written_by,
    created_at,
    email,
  } = req.body;

  if (
    !title ||
    !description ||
    !content ||
    !written_by ||
    !created_at ||
    !email
  ) {
    return res
      .status(400)
      .json({ error: "All fields, including email, are required." });
  }

  // Email regex for validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ error: "Invalid email format. Please provide a valid email." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO journals (title, description, content, written_by, created_at, email)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, title, description, content, written_by, created_at, email`,
      [title, description, content, written_by, new Date(created_at), email]
    );

    const journal = result.rows[0];
    journal.created_at = formatDate(new Date(journal.created_at)); // Format created_at
    res.status(201).json(journal);
  } catch (err) {
    console.error("Error adding journal:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret", // Fallback for development
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Ensure cookies are only sent over HTTPS in production
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
      maxAge: 15 * 60 * 1000, // 15 minutes
    },
  })
);

//admin login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!process.env.SESSION_SECRET) {
    console.error("SESSION_SECRET is not defined in environment variables.");
    process.exit(1);

    // Exit the application
  }

  const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "";
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // Initialize session after validation
    req.session.user = { role: "admin" }; // Example session object
    req.session.adminLoggedIn = true; // Track admin login
    return res.status(200).json({ success: true, message: "Logged in" });
  } else {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }
});

app.get("/admin-session", (req, res) => {
  if (req.session.adminLoggedIn) {
    res.json({ loggedIn: true });
  } else {
    res.json({ loggedIn: false });
  }
});

const requireAdmin = (req, res, next) => {
  if (req.session.adminLoggedIn) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};

// Example protected route
app.get("/admin-dashboard", requireAdmin, (req, res) => {
  res.json({ message: "Welcome Admin!" });
});

// Admin logout endpoint
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res.status(500).json({ error: "Failed to logout" });
    } else {
      res.status(200).json({ success: true, message: "Logged out" });
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for Vercel serverless
export default app;

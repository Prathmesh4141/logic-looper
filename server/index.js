import express from "express";
import cors from "cors";
import pkg from "pg";
import crypto from "crypto";

const SECRET_KEY = "logic-looper-secret"; // keep secret

function createSeedHash(date) {
  return crypto
    .createHash("sha256")
    .update(date + SECRET_KEY)
    .digest("hex");
}

const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_4Np9RBdiGcof@ep-wild-meadow-aixtuy1i-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require",
  ssl: {
    rejectUnauthorized: false,
  },
});

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// SAVE SCORE
app.post("/score", async (req, res) => {
  const { user, score, timeTaken, difficulty, date, hash } = req.body;

  // 1️⃣ Validate date
  const today = new Date().toISOString().slice(0, 10);
  if (date !== today) {
    return res.status(400).send("Invalid date");
  }

  // 2️⃣ Validate time
  if (timeTaken < 1 || timeTaken > 120) {
    return res.status(400).send("Invalid completion time");
  }

  // 3️⃣ Validate score range
  if (score < 0 || score > 10000) {
    return res.status(400).send("Invalid score");
  }

  // 4️⃣ Validate hash (anti-tampering)
  const expectedHash = createSeedHash(date);
  if (hash !== expectedHash) {
    return res.status(400).send("Invalid puzzle seed");
  }

  // 5️⃣ Save score safely
  // save session history
await pool.query(
  `INSERT INTO sessions (username, score, time_taken, difficulty)
   VALUES ($1, $2, $3, $4)`,
  [user, score, timeTaken, difficulty]
);

// update leaderboard (best score)
await pool.query(
  `INSERT INTO scores (username, score)
   VALUES ($1, $2)
   ON CONFLICT (username)
   DO UPDATE SET score = GREATEST(scores.score, EXCLUDED.score);`,
  [user, score]
);

  res.send("Score saved securely");
});


// LEADERBOARD
app.get("/leaderboard", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT username, score FROM scores ORDER BY score DESC LIMIT 3"
    );

    console.log("Leaderboard data:", result.rows); // 🔥 DEBUG
    res.json(result.rows);
  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).send("Error fetching leaderboard");
  }
});

// 🏆 Champion Route
app.get("/champion", async (req, res) => {
  const result = await pool.query(
    `SELECT username, score
     FROM scores
     ORDER BY score DESC
     LIMIT 1`
  );

  res.json(result.rows[0]);
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});


app.get("/user-history/:name", async (req, res) => {
  try {
    const { name } = req.params;

    const result = await pool.query(
      `SELECT score, created_at
       FROM sessions
       WHERE username = $1
       ORDER BY created_at DESC
       LIMIT 10`,
      [name]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching history");
  }
});

 

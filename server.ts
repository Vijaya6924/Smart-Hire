import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Database from "better-sqlite3";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("smarthire.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    mobile TEXT,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS companies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    logo TEXT,
    zone TEXT CHECK(zone IN ('IT', 'Non-IT')),
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER,
    role TEXT NOT NULL,
    location TEXT,
    salary TEXT,
    experience TEXT,
    work_mode TEXT,
    qualification TEXT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(company_id) REFERENCES companies(id)
  );

  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    job_id INTEGER,
    status TEXT DEFAULT 'Under Review',
    full_name TEXT,
    dob TEXT,
    gender TEXT,
    address TEXT,
    qualification TEXT,
    degree TEXT,
    university TEXT,
    passing_year INTEGER,
    percentage REAL,
    resume_url TEXT,
    photo_url TEXT,
    signature_url TEXT,
    voice_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(job_id) REFERENCES jobs(id)
  );

  CREATE TABLE IF NOT EXISTS assessments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id INTEGER,
    title TEXT NOT NULL,
    duration INTEGER, -- in minutes
    instructions TEXT,
    FOREIGN KEY(job_id) REFERENCES jobs(id)
  );

  CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    assessment_id INTEGER,
    question TEXT NOT NULL,
    options TEXT, -- JSON string
    correct_option INTEGER,
    type TEXT DEFAULT 'MCQ',
    FOREIGN KEY(assessment_id) REFERENCES assessments(id)
  );

  CREATE TABLE IF NOT EXISTS results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    assessment_id INTEGER,
    score INTEGER,
    total_questions INTEGER,
    feedback TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(assessment_id) REFERENCES assessments(id)
  );
`);

// Seed initial data if empty
const companyCount = db.prepare("SELECT COUNT(*) as count FROM companies").get() as { count: number };
if (companyCount.count === 0) {
  const insertCompany = db.prepare("INSERT INTO companies (name, logo, zone, description) VALUES (?, ?, ?, ?)");
  insertCompany.run("TechCorp", "https://picsum.photos/seed/tech/100/100", "IT", "Leading tech solutions provider.");
  insertCompany.run("BuildIt", "https://picsum.photos/seed/build/100/100", "Non-IT", "Premier construction firm.");

  const insertJob = db.prepare("INSERT INTO jobs (company_id, role, location, salary, experience, work_mode, qualification, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
  insertJob.run(1, "Senior Frontend Developer", "Bangalore", "15-25 LPA", "5+ Years", "Remote", "B.Tech/BE", "Expertise in React and Tailwind required.");
  insertJob.run(2, "Civil Engineer", "Mumbai", "8-12 LPA", "3+ Years", "Onsite", "B.Tech Civil", "Experience in high-rise construction.");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/jobs", (req, res) => {
    const jobs = db.prepare(`
      SELECT jobs.*, companies.name as company_name, companies.logo as company_logo, companies.zone 
      FROM jobs 
      JOIN companies ON jobs.company_id = companies.id
    `).all();
    res.json(jobs);
  });

  app.get("/api/jobs/:id", (req, res) => {
    const job = db.prepare(`
      SELECT jobs.*, companies.name as company_name, companies.logo as company_logo, companies.zone 
      FROM jobs 
      JOIN companies ON jobs.company_id = companies.id
      WHERE jobs.id = ?
    `).get(req.params.id);
    res.json(job);
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    // Simple auth for demo
    const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password);
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  app.post("/api/auth/signup", (req, res) => {
    const { name, email, password, mobile } = req.body;
    try {
      const info = db.prepare("INSERT INTO users (name, email, password, mobile) VALUES (?, ?, ?, ?)").run(name, email, password, mobile);
      res.json({ success: true, userId: info.lastInsertRowid });
    } catch (err) {
      res.status(400).json({ success: false, message: "Email already exists" });
    }
  });

  app.get("/api/applications/:userId", (req, res) => {
    const apps = db.prepare(`
      SELECT applications.*, jobs.role, companies.name as company_name 
      FROM applications 
      JOIN jobs ON applications.job_id = jobs.id
      JOIN companies ON jobs.company_id = companies.id
      WHERE applications.user_id = ?
    `).all(req.params.userId);
    res.json(apps);
  });

  app.post("/api/applications", (req, res) => {
    const data = req.body;
    const stmt = db.prepare(`
      INSERT INTO applications (
        user_id, job_id, full_name, dob, gender, address, 
        qualification, degree, university, passing_year, percentage,
        resume_url, photo_url, signature_url, voice_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      data.user_id, data.job_id, data.full_name, data.dob, data.gender, data.address,
      data.qualification, data.degree, data.university, data.passing_year, data.percentage,
      data.resume_url, data.photo_url, data.signature_url, data.voice_url
    );
    res.json({ success: true, id: info.lastInsertRowid });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

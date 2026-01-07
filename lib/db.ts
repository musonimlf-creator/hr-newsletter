import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Database file path (stored in project root)
const DB_PATH = path.join(process.cwd(), 'newsletter.db');

// Ensure database directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize database connection
let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (db) {
    return db;
  }

  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL'); // Better concurrency
  db.pragma('foreign_keys = ON'); // Enable foreign keys

  // Initialize schema
  initializeSchema(db);

  return db;
}

function initializeSchema(database: Database.Database) {
  // Newsletters table - stores newsletter periods
  database.exec(`
    CREATE TABLE IF NOT EXISTS newsletters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      month TEXT NOT NULL,
      year TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(month, year)
    );
  `);

  // Newsletter entries table - stores all newsletter content
  database.exec(`
    CREATE TABLE IF NOT EXISTS newsletter_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      newsletter_id INTEGER NOT NULL,
      category TEXT NOT NULL,
      entry_type TEXT NOT NULL, -- 'employee' or 'event'
      name TEXT,
      position TEXT,
      department TEXT,
      from_department TEXT,
      to_department TEXT,
      date TEXT,
      achievement TEXT,
      title TEXT, -- for events
      description TEXT, -- for events
      entry_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (newsletter_id) REFERENCES newsletters(id) ON DELETE CASCADE
    );
  `);

  // Comments table - stores comments on entries
  database.exec(`
    CREATE TABLE IF NOT EXISTS entry_comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entry_id INTEGER NOT NULL,
      user TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (entry_id) REFERENCES newsletter_entries(id) ON DELETE CASCADE
    );
  `);

  // Create indexes for better performance
  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_newsletter_entries_newsletter_id ON newsletter_entries(newsletter_id);
    CREATE INDEX IF NOT EXISTS idx_newsletter_entries_category ON newsletter_entries(category);
    CREATE INDEX IF NOT EXISTS idx_entry_comments_entry_id ON entry_comments(entry_id);
  `);
}

// Close database connection (useful for cleanup)
export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}


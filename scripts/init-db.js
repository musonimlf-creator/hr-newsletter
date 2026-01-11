/* eslint-disable @typescript-eslint/no-require-imports */
// Database initialization script
// Run this manually if needed: node scripts/init-db.js

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(process.cwd(), 'newsletter.db');

console.log('Initializing database at:', DB_PATH);

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS newsletters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    month TEXT NOT NULL,
    year TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(month, year)
  );

  CREATE TABLE IF NOT EXISTS newsletter_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    newsletter_id INTEGER NOT NULL,
    category TEXT NOT NULL,
    entry_type TEXT NOT NULL,
    name TEXT,
    position TEXT,
    department TEXT,
    from_department TEXT,
    to_department TEXT,
    date TEXT,
    achievement TEXT,
    photo_url TEXT,
    title TEXT,
    description TEXT,
    entry_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (newsletter_id) REFERENCES newsletters(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS entry_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entry_id INTEGER NOT NULL,
    user TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (entry_id) REFERENCES newsletter_entries(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_newsletter_entries_newsletter_id ON newsletter_entries(newsletter_id);
  CREATE INDEX IF NOT EXISTS idx_newsletter_entries_category ON newsletter_entries(category);
  CREATE INDEX IF NOT EXISTS idx_entry_comments_entry_id ON entry_comments(entry_id);
`);

console.log('Database initialized successfully!');
db.close();

const fs = require('fs');
const path = require('path');

// This script creates or overwrites `newsletter.db` in the project root
// and seeds it with one newsletter (January 2026) and several sample entries.
// Run with: pnpm --filter hr-newsletter exec node scripts/seed-db.js

const DB_PATH = path.join(process.cwd(), 'newsletter.db');
const Database = require('better-sqlite3');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function createSchema(db) {
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
      title TEXT,
      description TEXT,
      photo_url TEXT,
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
  `);
}

function seedData(db) {
  const insertNewsletter = db.prepare('INSERT OR IGNORE INTO newsletters (month, year) VALUES (?, ?)');
  insertNewsletter.run('January', '2026');

  const newsletter = db.prepare('SELECT id FROM newsletters WHERE month = ? AND year = ?').get('January', '2026');
  const nid = newsletter.id;

  const insertEntry = db.prepare(`INSERT INTO newsletter_entries (
    newsletter_id, category, entry_type, name, position, department, date, achievement, photo_url, entry_order
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  insertEntry.run(nid, 'new_hires', 'employee', 'Alice Example', 'Software Engineer', 'Engineering', '2026-01-05', 'Joined the backend team', 'https://images.example.com/alice.jpg', 10);
  insertEntry.run(nid, 'promotions', 'employee', 'Bob Example', 'Senior PM', 'Products', '2026-01-15', 'Promoted from PM to Senior PM', '/assets/bob.png', 20);
  insertEntry.run(nid, 'transfers', 'employee', 'Chris Example', 'Analyst', 'Finance', '2026-01-20', null, 'http://%zz', 30);

  const insertComment = db.prepare('INSERT INTO entry_comments (entry_id, user, content) VALUES (?, ?, ?)');
  const firstEntry = db.prepare('SELECT id FROM newsletter_entries WHERE newsletter_id = ? ORDER BY id LIMIT 1').get(nid);
  insertComment.run(firstEntry.id, 'Admin', 'Welcome to the team, Alice!');
}

function main() {
  try {
    const db = new Database(DB_PATH);
    createSchema(db);
    seedData(db);
    db.close();
    console.log('Created and seeded:', DB_PATH);
  } catch (err) {
    console.error('Failed to create/seed DB:', err && err.message ? err.message : err);
    process.exit(1);
  }
}

main();

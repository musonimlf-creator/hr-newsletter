import path from 'path';
import fs from 'fs';

// Lazy-load better-sqlite3 to allow graceful error messages when native bindings are missing
// Do NOT require it at import time; instead require only when needed inside getDatabase().
let BetterSqlite3: any = null;


// Database file path (stored in project root)
const DB_PATH = path.join(process.cwd(), 'newsletter.db');

// Ensure database directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize database connection
let db: any = null;

// Lightweight in-memory fallback for development/test when native bindings are missing
class InMemoryDB {
  newsletters: Array<any> = [];
  newsletter_entries: Array<any> = [];
  entry_comments: Array<any> = [];
  _newsId = 1;
  _entryId = 1;
  _commentId = 1;

  constructor(initialState?: any) {
    // If a seed JSON exists, initialize state from it so we have persistent sample data
    if (initialState) {
      this.newsletters = initialState.newsletters || [];
      this.newsletter_entries = initialState.newsletter_entries || [];
      this.entry_comments = initialState.entry_comments || [];
      this._newsId = initialState._newsId || (this.newsletters.length + 1);
      this._entryId = initialState._entryId || (this.newsletter_entries.length + 1);
      this._commentId = initialState._commentId || (this.entry_comments.length + 1);
    }
  }

  private saveSeed() {
    try {
      const seed = {
        newsletters: this.newsletters,
        newsletter_entries: this.newsletter_entries,
        entry_comments: this.entry_comments,
        _newsId: this._newsId,
        _entryId: this._entryId,
        _commentId: this._commentId
      };
      const outPath = path.join(process.cwd(), 'newsletter.seed.json');
      fs.writeFileSync(outPath, JSON.stringify(seed, null, 2), 'utf8');
      // eslint-disable-next-line no-console
      console.info('Saved in-memory DB state to newsletter.seed.json');
    } catch (err) {
      console.warn('Failed to save in-memory DB seed file:', err instanceof Error ? err.message : String(err));
    }
  }

  exec(_sql: string) {
    // No-op for CREATE TABLE / INDEX statements
    return;
  }

  prepare(sql: string) {
    const s = sql.trim();

    // INSERT INTO newsletters (month, year) VALUES (?, ?)
    if (/^INSERT\s+INTO\s+newsletters/i.test(s)) {
      return {
        run: (month: string, year: string) => {
          const id = this._newsId++;
          const now = new Date().toISOString();
          this.newsletters.push({ id, month, year, created_at: now, updated_at: now });
          // persist state
          try { this.saveSeed(); } catch (e) { /* ignore */ }
          return { lastInsertRowid: id };
        }
      };
    }

    // SELECT * FROM newsletters WHERE month = ? AND year = ?
    if (/SELECT\s+\*\s+FROM\s+newsletters/i.test(s) && /WHERE\s+month\s*=\s*\?\s+AND\s+year\s*=\s*\?/i.test(s)) {
      return {
        get: (month: string, year: string) => {
          return this.newsletters.find(n => n.month === month && n.year === year);
        }
      };
    }

    // UPDATE newsletters SET updated_at = CURRENT_TIMESTAMP WHERE id = ?
    if (/^UPDATE\s+newsletters/i.test(s) && /SET\s+updated_at/i.test(s)) {
      return {
        run: (id: number) => {
          const found = this.newsletters.find(n => n.id === id);
          if (found) {
            found.updated_at = new Date().toISOString();
            try { this.saveSeed(); } catch (e) { /* ignore */ }
          }
          return { changes: found ? 1 : 0 };
        }
      };
    }

    // SELECT * FROM newsletter_entries WHERE newsletter_id = ? ORDER BY
    if (/SELECT\s+\*\s+FROM\s+newsletter_entries/i.test(s) && /WHERE\s+newsletter_id\s*=\s*\?/i.test(s)) {
      return {
        all: (newsletterId: number) => {
          return this.newsletter_entries
            .filter(e => e.newsletter_id === Number(newsletterId))
            .sort((a, b) => {
              if (a.category < b.category) return -1;
              if (a.category > b.category) return 1;
              if ((a.entry_order || 0) < (b.entry_order || 0)) return -1;
              if ((a.entry_order || 0) > (b.entry_order || 0)) return 1;
              return (a.id - b.id);
            });
        }
      };
    }

    // SELECT * FROM entry_comments WHERE entry_id IN (?, ?, ...)
    if (/SELECT\s+\*\s+FROM\s+entry_comments/i.test(s) && /WHERE\s+entry_id\s+IN/i.test(s)) {
      return {
        all: (...entryIds: number[]) => {
          const ids = entryIds.map(Number);
          return this.entry_comments.filter(c => ids.includes(Number(c.entry_id))).sort((a, b) => a.id - b.id);
        }
      };
    }

    // INSERT INTO newsletter_entries (... ) VALUES (...)
    if (/^INSERT\s+INTO\s+newsletter_entries/i.test(s)) {
      return {
        run: (
          newsletter_id: number,
          category: string,
          entry_type: string,
          name: string | null,
          position: string | null,
          department: string | null,
          previous_position: string | null,
          previous_department: string | null,
          from_position: string | null,
          to_position: string | null,
          from_department: string | null,
          to_department: string | null,
          blurb: string | null,
          date: string | null,
          achievement: string | null,
          photo_url: string | null,
          title: string | null,
          description: string | null,
          entry_order: number
        ) => {
          const id = this._entryId++;
          this.newsletter_entries.push({
            id,
            newsletter_id: Number(newsletter_id),
            category,
            entry_type,
            name,
            position,
            department,
            previous_position,
            previous_department,
            from_position,
            to_position,
            from_department,
            to_department,
            blurb,
            date,
            achievement,
            photo_url,
            title,
            description,
            entry_order: Number(entry_order),
          });
          // persist state
          try { this.saveSeed(); } catch (e) { /* ignore */ }
          return { lastInsertRowid: id };
        }
      };
    }

    // DELETE FROM newsletter_entries WHERE newsletter_id = ?
    if (/^DELETE\s+FROM\s+newsletter_entries/i.test(s) && /WHERE\s+newsletter_id\s*=\s*\?/i.test(s)) {
      return {
        run: (newsletterId: number) => {
          const toDelete = this.newsletter_entries.filter(e => e.newsletter_id === Number(newsletterId)).map(e => e.id);
          this.newsletter_entries = this.newsletter_entries.filter(e => e.newsletter_id !== Number(newsletterId));
          // Cascade delete comments
          this.entry_comments = this.entry_comments.filter(c => !toDelete.includes(Number(c.entry_id)));
          try { this.saveSeed(); } catch (e) { /* ignore */ }
          return { changes: toDelete.length };
        }
      };
    }

    // INSERT INTO entry_comments (entry_id, user, content) VALUES (?, ?, ?)
    if (/^INSERT\s+INTO\s+entry_comments/i.test(s)) {
      return {
        run: (entryId: number, user: string, content: string) => {
          const id = this._commentId++;
          const date = new Date().toISOString();
          this.entry_comments.push({ id, entry_id: Number(entryId), user, content, created_at: date });
          try { this.saveSeed(); } catch (e) { /* ignore */ }
          return { lastInsertRowid: id };
        }
      };
    }

    // Fallback statement that does nothing and returns empty results
    return {
      run: () => ({ changes: 0 }),
      get: () => undefined,
      all: () => []
    } as any;
  }

  // Mimic better-sqlite3's transaction API: `const tx = db.transaction(fn); tx();`
  transaction(fn: () => any) {
    const self = this;
    return function wrappedTransaction(...args: any[]) {
      // Snapshot current state
      const backup = {
        newsletters: JSON.parse(JSON.stringify(self.newsletters)),
        newsletter_entries: JSON.parse(JSON.stringify(self.newsletter_entries)),
        entry_comments: JSON.parse(JSON.stringify(self.entry_comments)),
        _newsId: self._newsId,
        _entryId: self._entryId,
        _commentId: self._commentId,
      };
      try {
        return fn(...args);
      } catch (err) {
        // Rollback
        self.newsletters = backup.newsletters;
        self.newsletter_entries = backup.newsletter_entries;
        self.entry_comments = backup.entry_comments;
        self._newsId = backup._newsId;
        self._entryId = backup._entryId;
        self._commentId = backup._commentId;
        throw err;
      }
    };
  }

  close() {
    this.newsletters = [];
    this.newsletter_entries = [];
    this.entry_comments = [];
    this._newsId = 1;
    this._entryId = 1;
    this._commentId = 1;
  }
}

export function getDatabase(): any {
  if (db) {
    return db;
  }

  // Use in-memory fallback in development or test if native bindings are missing or forced
  const forceMemory = process.env.USE_IN_MEMORY_DB === '1';
  const isDevOrTest = (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test');
  // Attempt to lazy-load native module only when not explicitly forcing memory and not in dev/test
  if (!BetterSqlite3 && !forceMemory && !isDevOrTest) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      BetterSqlite3 = require('better-sqlite3');
    } catch (err: any) {
      console.warn('better-sqlite3 native bindings could not be loaded:', err instanceof Error ? err.message : String(err));
      BetterSqlite3 = null;
    }
  }
  if (!BetterSqlite3 && (isDevOrTest || forceMemory)) {
    // If a seed JSON exists, load it so the in-memory DB is pre-populated persistently
    const seedPath = path.join(process.cwd(), 'newsletter.seed.json');
    let initialState = undefined as any;
    try {
      if (fs.existsSync(seedPath)) {
        const raw = fs.readFileSync(seedPath, 'utf8');
        initialState = JSON.parse(raw);
        console.info('Loaded seed data from newsletter.seed.json');
      }
    } catch (err) {
      console.warn('Failed to load seed file:', err instanceof Error ? err.message : String(err));
    }

    console.warn('Using in-memory fallback database (better-sqlite3 not available).');
    db = new InMemoryDB(initialState);
    // Initialize schema (no-op for in-memory)
    initializeSchema(db);
    return db;
  }

  // If the native module failed to load, throw a helpful error with instructions
  if (!BetterSqlite3) {
    const msg = `better-sqlite3 native bindings are not available.\n` +
      `Possible fixes:\n` +
      `  1) Run 'pnpm install' to ensure native binaries are present.\n` +
      `  2) If that fails, rebuild native modules: 'pnpm rebuild --filter better-sqlite3' or 'pnpm rebuild --filter better-sqlite3 --workspace-root'.\n` +
      `  3) Ensure a compatible Node.js version and Windows build tools are installed (Visual Studio Build Tools).\n` +
      `See server console for original error details.`;
    const err = new Error(msg);
    // Attach extra hint to the error for server-side logs
    // @ts-ignore
    err.hint = 'better-sqlite3-binding-missing';
    throw err;
  }

  try {
    db = new BetterSqlite3(DB_PATH);
    db.pragma('journal_mode = WAL'); // Better concurrency
    db.pragma('foreign_keys = ON'); // Enable foreign keys

    // Initialize schema
    initializeSchema(db);

    return db;
  } catch (err: any) {
    // Keep the console output concise; include a hint for resolving the issue
    console.warn('better-sqlite3 failed to initialize:', err instanceof Error ? err.message : String(err));
    // If in dev/test or explicitly forced, fall back to in-memory DB
    const forceMemory = process.env.USE_IN_MEMORY_DB === '1';
    const isDevOrTest = (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test');
    if (isDevOrTest || forceMemory) {
      console.warn('Falling back to in-memory DB due to native module init failure. To avoid this, install native bindings or set USE_IN_MEMORY_DB=0 to surface the error.');
      db = new InMemoryDB();
      initializeSchema(db);
      return db;
    }

    // Otherwise, rethrow a helpful error
    const msg = `Failed to initialize better-sqlite3 native module: ${err instanceof Error ? err.message : String(err)}\n` +
      `If you want to allow running without native bindings for development, set USE_IN_MEMORY_DB=1.`;
    const newErr = new Error(msg);
    // @ts-ignore
    newErr.original = err;
    throw newErr;
  }
}

function initializeSchema(database: any) {
  // For real sqlite the exec will create tables; for in-memory this is a no-op
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


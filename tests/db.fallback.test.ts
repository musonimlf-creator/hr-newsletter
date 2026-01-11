import { describe, it, expect, beforeEach, afterEach } from 'vitest';

// Ensure the in-memory fallback is used for tests
process.env.USE_IN_MEMORY_DB = '1';

import { getDatabase, closeDatabase } from '../lib/db';

describe('InMemoryDB fallback', () => {
  let db: any;

  beforeEach(() => {
    // Fresh instance for each test
    closeDatabase();
    db = getDatabase();
  });

  afterEach(() => {
    closeDatabase();
  });

  it('creates and fetches a newsletter', () => {
    const res = db.prepare('INSERT INTO newsletters (month, year) VALUES (?, ?)').run('January', '2026');
    expect(res.lastInsertRowid).toBeDefined();

    const found = db.prepare('SELECT * FROM newsletters WHERE month = ? AND year = ?').get('January', '2026');
    expect(found).toBeDefined();
    expect(found.month).toBe('January');
    expect(found.year).toBe('2026');
  });

  it('inserts entries and comments and queries them', () => {
    const n = db.prepare('INSERT INTO newsletters (month, year) VALUES (?, ?)').run('Jan', '2026');
    const newsletterId = n.lastInsertRowid;

    const entry = db.prepare(`INSERT INTO newsletter_entries (
      newsletter_id, category, entry_type, name, position, department, from_department, to_department, date, achievement, photo_url, title, description, entry_order
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(newsletterId, 'newHires', 'employee', 'Alice', 'Engineer', 'R&D', null, null, '2026-01-01', null, null, null, null, 0);

    expect(entry.lastInsertRowid).toBeDefined();

    const entries = db.prepare('SELECT * FROM newsletter_entries WHERE newsletter_id = ? ORDER BY category, entry_order, id').all(newsletterId);
    expect(entries.length).toBe(1);
    expect(entries[0].name).toBe('Alice');

    const c = db.prepare('INSERT INTO entry_comments (entry_id, user, content) VALUES (?, ?, ?)').run(entries[0].id, 'bob', 'Nice hire');
    expect(c.lastInsertRowid).toBeDefined();

    const comments = db.prepare(`SELECT * FROM entry_comments WHERE entry_id IN (?, ?)`).all(entries[0].id, 9999);
    expect(comments.length).toBe(1);
    expect(comments[0].content).toBe('Nice hire');
  });

  it('supports transactions and rollbacks', () => {
    const n = db.prepare('INSERT INTO newsletters (month, year) VALUES (?, ?)').run('Feb', '2026');
    const newsletterId = n.lastInsertRowid;

    expect(() => {
      const tx = db.transaction(() => {
        db.prepare('INSERT INTO newsletter_entries (newsletter_id, category, entry_type, name, position, department, from_department, to_department, date, achievement, photo_url, title, description, entry_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
          .run(newsletterId, 'newHires', 'employee', 'Charlie', 'Designer', 'UX', null, null, '2026-02-01', null, null, null, null, 0);
        throw new Error('fail');
      });
      tx();
    }).toThrow();

    const entries = db.prepare('SELECT * FROM newsletter_entries WHERE newsletter_id = ?').all(newsletterId);
    expect(entries.length).toBe(0);
  });
});
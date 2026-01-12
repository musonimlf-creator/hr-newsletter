import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

process.env.USE_IN_MEMORY_DB = '1';

import { getDatabase, closeDatabase } from '../lib/db';

// Mock the path alias used in the route so Vite/Vitest can resolve it in tests
vi.mock('@/lib/db', async () => {
  return await import('../lib/db');
});

import { GET, POST } from '../app/api/newsletter/route';

describe('Newsletter API route', () => {
  let db: any;

  beforeEach(() => {
    closeDatabase();
    db = getDatabase();
  });

  afterEach(() => {
    closeDatabase();
  });

  it('GET returns newsletter data without throwing ReferenceError', async () => {
    const n = db.prepare('INSERT INTO newsletters (month, year) VALUES (?, ?)').run('Jan', '2026');
    const newsletterId = n.lastInsertRowid;

    db.prepare(`INSERT INTO newsletter_entries (
      newsletter_id, category, entry_type, name, position, department, previous_position, previous_department, from_position, to_position, from_department, to_department, blurb, date, achievement, photo_url, title, description, entry_order
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(newsletterId, 'newHires', 'employee', 'Alice', 'Engineer', 'R&D', null, null, null, null, null, null, null, '2026-01-01', null, null, null, null, 0);

    const fakeReq = { url: 'http://localhost/api/newsletter?month=Jan&year=2026' } as unknown as Request;

    const res = await GET(fakeReq as any);
    const body = await res.json();

    expect(body).toBeDefined();
    expect(body.data).toBeDefined();
    expect(body.data.newHires.length).toBeGreaterThan(0);
    expect(body.data.newHires[0].name).toBe('Alice');
  });

  it('POST saves newsletter entries to seed file', async () => {
    const fs = await import('fs');
    const path = await import('path');
    const seedPath = path.join(process.cwd(), 'newsletter.seed.json');
    if (fs.existsSync(seedPath)) fs.unlinkSync(seedPath);

    const payload = {
      month: 'Mar',
      year: '2026',
      data: {
        month: 'Mar',
        year: '2026',
        newHires: [{ id: '', name: 'TestUser', position: 'Engineer', department: 'R&D', photoUrl: null }],
        promotions: [],
        transfers: [],
        birthdays: [],
        anniversaries: [],
        events: [],
        bestEmployee: null,
        bestPerformer: null,
        exitingEmployees: []
      }
    } as any;

    const fakeReq = {
      json: async () => payload
    } as unknown as Request;

    const res = await POST(fakeReq as any);
    const body = await res.json();
    expect(body.success).toBe(true);

    // Give the save a moment
    await new Promise((r) => setTimeout(r, 20));
    const raw = fs.readFileSync(seedPath, 'utf8');
    const seed = JSON.parse(raw);
    const hasTestUser = seed.newsletter_entries.some((e: any) => e.name === 'TestUser');
    expect(hasTestUser).toBe(true);
  });

  it('GET returns data from seed file when present', async () => {
    const fakeReq = { url: 'http://localhost/api/newsletter?month=Jan&year=2026' } as unknown as Request;
    const res = await GET(fakeReq as any);
    const body = await res.json();
    expect(body.data.newHires.length).toBeGreaterThan(0);
  });

  it('Promotions previous fields persist after save and are returned by GET', async () => {
    const fs = await import('fs');
    const path = await import('path');
    const seedPath = path.join(process.cwd(), 'newsletter.seed.json');
    if (fs.existsSync(seedPath)) fs.unlinkSync(seedPath);

    const payload = {
      month: 'Apr',
      year: '2026',
      data: {
        month: 'Apr',
        year: '2026',
        newHires: [],
        promotions: [{ id: '', name: 'PromoUser', position: 'Senior Engineer', department: 'Platform', previousPosition: 'Engineer', previousDepartment: 'R&D', photoUrl: null }],
        transfers: [],
        birthdays: [],
        anniversaries: [],
        events: [],
        bestEmployee: null,
        bestPerformer: null,
        exitingEmployees: []
      }
    } as any;

    const fakeReq = {
      json: async () => payload
    } as unknown as Request;

    const res = await POST(fakeReq as any);
    const body = await res.json();
    expect(body.success).toBe(true);

    // Allow save to flush
    await new Promise((r) => setTimeout(r, 20));
    const raw = fs.readFileSync(seedPath, 'utf8');
    const seed = JSON.parse(raw);
    const entry = seed.newsletter_entries.find((e: any) => e.name === 'PromoUser');
    expect(entry).toBeDefined();
    expect(entry.previous_position).toBe('Engineer');
    expect(entry.previous_department).toBe('R&D');

    // Now GET and ensure fields come back
    const fakeGet = { url: 'http://localhost/api/newsletter?month=Apr&year=2026' } as unknown as Request;
    const getRes = await GET(fakeGet as any);
    const getBody = await getRes.json();
    expect(getBody.data.promotions.length).toBe(1);
    expect(getBody.data.promotions[0].previousPosition).toBe('Engineer');
    expect(getBody.data.promotions[0].previousDepartment).toBe('R&D');
  });

  it('Events entries persist after save and are returned by GET', async () => {
    const fs = await import('fs');
    const path = await import('path');
    const seedPath = path.join(process.cwd(), 'newsletter.seed.json');
    if (fs.existsSync(seedPath)) fs.unlinkSync(seedPath);

    const payload = {
      month: 'May',
      year: '2026',
      data: {
        month: 'May',
        year: '2026',
        newHires: [],
        promotions: [],
        transfers: [],
        birthdays: [],
        anniversaries: [],
        events: [
          { id: '', title: 'Town Hall', date: '2026-05-01', description: 'Company town hall' },
          { id: '', title: 'Hackathon', date: '2026-05-15', description: '24-hour hackathon' }
        ],
        bestEmployee: null,
        bestPerformer: null,
        exitingEmployees: []
      }
    } as any;

    const fakeReq = { json: async () => payload } as unknown as Request;
    const res = await POST(fakeReq as any);
    const body = await res.json();
    expect(body.success).toBe(true);

    // Allow save to flush
    await new Promise((r) => setTimeout(r, 20));
    const raw = fs.readFileSync(seedPath, 'utf8');
    const seed = JSON.parse(raw);

    const town = seed.newsletter_entries.find((e: any) => e.title === 'Town Hall');
    expect(town).toBeDefined();
    expect(town.description).toBe('Company town hall');
    expect(town.date).toBe('2026-05-01');

    // Now GET
    const fakeGet = { url: 'http://localhost/api/newsletter?month=May&year=2026' } as unknown as Request;
    const getRes = await GET(fakeGet as any);
    const getBody = await getRes.json();
    expect(getBody.data.events.length).toBe(2);
    expect(getBody.data.events[0].title).toBe('Town Hall');
    expect(getBody.data.events[0].description).toBe('Company town hall');
  });

  it('Best employee achievement persists after save and is returned by GET', async () => {
    const fs = await import('fs');
    const path = await import('path');
    const seedPath = path.join(process.cwd(), 'newsletter.seed.json');
    if (fs.existsSync(seedPath)) fs.unlinkSync(seedPath);

    const payload = {
      month: 'Jun',
      year: '2026',
      data: {
        month: 'Jun',
        year: '2026',
        newHires: [],
        promotions: [],
        transfers: [],
        birthdays: [],
        anniversaries: [],
        events: [],
        bestEmployee: { id: '', name: 'Star', position: 'Lead', department: 'Eng', achievement: 'Outstanding innovation' },
        bestPerformer: null,
        exitingEmployees: []
      }
    } as any;

    const fakeReq2 = { json: async () => payload } as unknown as Request;
    const res2 = await POST(fakeReq2 as any);
    const body2 = await res2.json();
    expect(body2.success).toBe(true);

    // Allow save
    await new Promise((r) => setTimeout(r, 20));
    const raw2 = fs.readFileSync(seedPath, 'utf8');
    const seed2 = JSON.parse(raw2);
    const be = seed2.newsletter_entries.find((e: any) => e.category === 'bestEmployee' && e.name === 'Star');
    expect(be).toBeDefined();
    expect(be.achievement).toBe('Outstanding innovation');

    const fakeGet2 = { url: 'http://localhost/api/newsletter?month=Jun&year=2026' } as unknown as Request;
    const getRes2 = await GET(fakeGet2 as any);
    const getBody2 = await getRes2.json();
    expect(getBody2.data.bestEmployee).toBeDefined();
    expect(getBody2.data.bestEmployee.achievement).toBe('Outstanding innovation');
  });
});

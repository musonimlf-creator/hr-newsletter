import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import type { NewsletterData, EmployeeComment, Employee, CategoryKey } from '@/types/newsletter';

function safeString(v: unknown) {
  return v === undefined || v === null ? '' : String(v);
}

// GET - Fetch newsletter data for a specific month/year
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    if (!month || !year) {
      return NextResponse.json(
        { error: 'Month and year are required' },
        { status: 400 }
      );
    }

    const db = getDatabase();

    // Get or create newsletter
    let newsletter = db
      .prepare('SELECT * FROM newsletters WHERE month = ? AND year = ?')
      .get(month, year) as { id: number; month: string; year: string } | undefined;

    if (!newsletter) {
      // Create new newsletter if it doesn't exist
      const result = db
        .prepare('INSERT INTO newsletters (month, year) VALUES (?, ?)')
        .run(month, year);
      newsletter = {
        id: Number(result.lastInsertRowid),
        month,
        year,
      };
    }

    // Fetch all entries for this newsletter
    const entries = db
      .prepare(
        'SELECT * FROM newsletter_entries WHERE newsletter_id = ? ORDER BY category, entry_order, id' // photo_url loaded via *
      )
      .all(newsletter.id) as Array<Record<string, unknown>>;

    // Fetch comments for entries
    const entryIds = entries.map((e) => e.id);
    const comments =
      entryIds.length > 0
        ? db
            .prepare(
              `SELECT * FROM entry_comments WHERE entry_id IN (${entryIds.map(() => '?').join(',')}) ORDER BY created_at`
            )
            .all(...entryIds) as Array<Record<string, unknown>>
        : [];

    // Group comments by entry_id
    const commentsByEntry: Record<number, EmployeeComment[]> = {};
    comments.forEach((comment) => {
      const entryId = Number(comment['entry_id']);
      if (!commentsByEntry[entryId]) {
        commentsByEntry[entryId] = [];
      }
      commentsByEntry[entryId].push({
        id: safeString(comment['id']).toString(),
        user: safeString(comment['user']),
        content: safeString(comment['content']),
        date: safeString(comment['created_at']),
      });
    });

    // Transform database entries to NewsletterData format
    const newsletterData: NewsletterData = {
      month: newsletter.month,
      year: newsletter.year,
      newHires: [],
      promotions: [],
      transfers: [],
      birthdays: [],
      anniversaries: [],
      events: [],
      bestEmployee: null,
      bestPerformer: null,
      exitingEmployees: [],
    };

    entries.forEach((entry) => {
      const id = Number(entry['id']);
      const category = safeString(entry['category']) as CategoryKey;

      const entryData: Partial<Employee> & { id: string; comments?: EmployeeComment[] } = {
        id: safeString(entry['id']),
        name: safeString(entry['name']),
        position: safeString(entry['position']),
        department: safeString(entry['department']),
        photoUrl: safeString(entry['photo_url']),
        date: safeString(entry['date']),
        blurb: safeString(entry['blurb']),
        achievement: safeString(entry['achievement']),
      };


      if (entry['from_department']) entryData.fromDepartment = safeString(entry['from_department']);
      if (entry['to_department']) entryData.toDepartment = safeString(entry['to_department']);
      if (entry['from_position']) entryData.fromPosition = safeString(entry['from_position']);
      if (entry['to_position']) entryData.toPosition = safeString(entry['to_position']);
      if (entry['previous_position']) entryData.previousPosition = safeString(entry['previous_position']);
      if (entry['previous_department']) entryData.previousDepartment = safeString(entry['previous_department']);
      if (category === 'events') {
        newsletterData.events.push({
          id: safeString(entry['id']),
          title: safeString(entry['title']),
          date: safeString(entry['date']),
          description: safeString(entry['description']),
        });
      } else if (category === 'bestEmployee' || category === 'bestPerformer') {
        // Best employee/perfomer are single objects, ensure required fields are present
        newsletterData[category] = {
          id: entryData.id,
          name: entryData.name || '',
          position: entryData.position || '',
          department: entryData.department || '',
          photoUrl: entryData.photoUrl,
          date: entryData.date,
          achievement: entryData.achievement,
          fromDepartment: entryData.fromDepartment,
          toDepartment: entryData.toDepartment,
          comments: entryData.comments,
        } as Employee;
      } else if (Array.isArray(newsletterData[category])) {
        (newsletterData[category] as Employee[]).push(entryData as Employee);
      }
    });

    return NextResponse.json({ data: newsletterData });
  } catch (error: unknown) {
    console.error('Error fetching newsletter:', error);
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;
    return NextResponse.json(
      {
        error: 'Failed to fetch newsletter data',
        details: message,
        stack,
        requestUrl: request.url,
        cwd: process.cwd(),
        nodeEnv: process.env.NODE_ENV || null,
      },
      { status: 500 }
    );
  }
}

// POST/PUT - Save newsletter data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { month, year, data } = body as {
      month: string;
      year: string;
      data: NewsletterData;
    };

    if (!month || !year || !data) {
      return NextResponse.json(
        { error: 'Month, year, and data are required' },
        { status: 400 }
      );
    }

    const db = getDatabase();
    db.transaction(() => {
      // Get or create newsletter
      let newsletter = db
        .prepare('SELECT * FROM newsletters WHERE month = ? AND year = ?')
        .get(month, year) as { id: number } | undefined;

      if (!newsletter) {
        const result = db
          .prepare('INSERT INTO newsletters (month, year) VALUES (?, ?)')
          .run(month, year);
        newsletter = { id: Number(result.lastInsertRowid) };
      } else {
        // Update timestamp
        db.prepare('UPDATE newsletters SET updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(newsletter.id);
      }

      const newsletterId = newsletter.id;

      // Delete all existing entries for this newsletter
      db.prepare('DELETE FROM newsletter_entries WHERE newsletter_id = ?').run(newsletterId);

      // Insert new entries
      const insertEntry = db.prepare(`
        INSERT INTO newsletter_entries (
          newsletter_id, category, entry_type, name, position, department,
          previous_position, previous_department, from_position, to_position, from_department, to_department, blurb,
          date, achievement, photo_url, title, description, entry_order
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      let order = 0;

      // Helper to insert employee entries
      const insertEmployeeEntries = (
        category: string,
        employees: Employee[] | Employee | null,
        isSingle = false
      ) => {
        if (isSingle && employees) {
          const emp = employees as Employee;
          insertEntry.run(
            newsletterId,
            category,
            'employee',
            emp.name || '',
            emp.position || '',
            emp.department || '',
            emp.previousPosition || null,
            emp.previousDepartment || null,
            emp.fromPosition || null,
            emp.toPosition || null,
            emp.fromDepartment || null,
            emp.toDepartment || null,
            emp.blurb || null,
            emp.date || null,
            emp.achievement || null,
            emp.photoUrl || null,
            null,
            null,
            order++
          );
        } else if (Array.isArray(employees)) {
          employees.forEach((emp) => {
            insertEntry.run(
              newsletterId,
              category,
              'employee',
              emp.name || '',
              emp.position || '',
              emp.department || '',
              emp.previousPosition || null,
              emp.previousDepartment || null,
              emp.fromPosition || null,
              emp.toPosition || null,
              emp.fromDepartment || null,
              emp.toDepartment || null,
              emp.blurb || null,
              emp.date || null,
              emp.achievement || null,
              emp.photoUrl || null,
              null,
              null,
              order++
            );
          });
        }
      };

      // Insert all categories
      insertEmployeeEntries('newHires', data.newHires);
      insertEmployeeEntries('promotions', data.promotions);
      insertEmployeeEntries('transfers', data.transfers);
      insertEmployeeEntries('birthdays', data.birthdays);
      insertEmployeeEntries('anniversaries', data.anniversaries);
      insertEmployeeEntries('exitingEmployees', data.exitingEmployees);
      insertEmployeeEntries('bestEmployee', data.bestEmployee, true);
      insertEmployeeEntries('bestPerformer', data.bestPerformer, true);

      // Insert events
      if (Array.isArray(data.events)) {
        data.events.forEach((event) => {
          insertEntry.run(
            newsletterId,
            'events',
            'event',
            null, // name
            null, // position
            null, // department
            null, // previous_position
            null, // previous_department
            null, // from_position
            null, // to_position
            null, // from_department
            null, // to_department
            null, // blurb
            event.date || null, // date
            null, // achievement
            null, // photo_url
            event.title || '',
            event.description || '',
            order++
          );
        });
      }
    })();

    return NextResponse.json({ success: true, message: 'Newsletter saved successfully' });
  } catch (error: unknown) {
    console.error('Error saving newsletter:', error);
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;
    return NextResponse.json(
      {
        error: 'Failed to save newsletter data',
        details: message,
        stack,
        requestUrl: request.url,
        cwd: process.cwd(),
        nodeEnv: process.env.NODE_ENV || null,
      },
      { status: 500 }
    );
  }
}


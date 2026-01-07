import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import type { NewsletterData } from '@/types/newsletter';

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
      .all(newsletter.id) as any[];

    // Fetch comments for entries
    const entryIds = entries.map((e) => e.id);
    const comments =
      entryIds.length > 0
        ? db
            .prepare(
              `SELECT * FROM entry_comments WHERE entry_id IN (${entryIds.map(() => '?').join(',')}) ORDER BY created_at`
            )
            .all(...entryIds)
        : [];

    // Group comments by entry_id
    const commentsByEntry: Record<number, any[]> = {};
    comments.forEach((comment: any) => {
      if (!commentsByEntry[comment.entry_id]) {
        commentsByEntry[comment.entry_id] = [];
      }
      commentsByEntry[comment.entry_id].push({
        id: comment.id.toString(),
        user: comment.user,
        content: comment.content,
        date: comment.created_at,
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
      const entryData: any = {
        id: entry.id.toString(),
        name: entry.name || '',
        position: entry.position || '',
        department: entry.department || '',
        photoUrl: entry.photo_url || '',
        date: entry.date || '',
      };


      if (entry.from_department) entryData.fromDepartment = entry.from_department;
      if (entry.to_department) entryData.toDepartment = entry.to_department;
      if (entry.achievement) entryData.achievement = entry.achievement;
      if (commentsByEntry[entry.id]) {
        entryData.comments = commentsByEntry[entry.id];
      }

      const category = entry.category as keyof NewsletterData;

      if (category === 'events') {
        newsletterData.events.push({
          id: entry.id.toString(),
          title: entry.title || '',
          date: entry.date || '',
          description: entry.description || '',
        });
      } else if (category === 'bestEmployee' || category === 'bestPerformer') {
        newsletterData[category] = entryData;
      } else if (Array.isArray(newsletterData[category])) {
        (newsletterData[category] as any[]).push(entryData);
      }
    });

    return NextResponse.json({ data: newsletterData });
  } catch (error: any) {
    console.error('Error fetching newsletter:', error);
    return NextResponse.json(
      { error: 'Failed to fetch newsletter data', details: error.message },
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
          from_department, to_department, date, achievement, photo_url, title, description, entry_order
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      let order = 0;

      // Helper to insert employee entries
      const insertEmployeeEntries = (
        category: string,
        employees: any[] | any | null,
        isSingle = false
      ) => {
        if (isSingle && employees) {
          const emp = employees as any;
          insertEntry.run(
            newsletterId,
            category,
            'employee',
            emp.name || '',
            emp.position || '',
            emp.department || '',
            emp.fromDepartment || null,
            emp.toDepartment || null,
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
              emp.fromDepartment || null,
              emp.toDepartment || null,
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
            null,
            null,
            null,
            null,
            null,
            event.date || null,
            null,
            event.title || '',
            event.description || '',
            order++
          );
        });
      }
    })();

    return NextResponse.json({ success: true, message: 'Newsletter saved successfully' });
  } catch (error: any) {
    console.error('Error saving newsletter:', error);
    return NextResponse.json(
      { error: 'Failed to save newsletter data', details: error.message },
      { status: 500 }
    );
  }
}


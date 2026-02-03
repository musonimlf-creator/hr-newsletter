import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const db = getDatabase();
    const rows = db.prepare(`
      SELECT e.*, n.month, n.year, e.created_at 
      FROM newsletter_entries e
      JOIN newsletters n ON e.newsletter_id = n.id
      ORDER BY e.created_at DESC
    `).all();

    return NextResponse.json({ data: rows });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch all posts for feed", details: String(err) },
      { status: 500 }
    );
  }
}

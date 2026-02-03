import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Math.max(Number(searchParams.get('limit') ?? 5), 1), 50);
    const offset = Math.max(Number(searchParams.get('offset') ?? 0), 0);

    const db = getDatabase();
    const rows = db
      .prepare(
        `
        SELECT month, year, updated_at, created_at
        FROM newsletters
        ORDER BY COALESCE(updated_at, created_at) DESC
        LIMIT ? OFFSET ?
      `
      )
      .all(limit, offset) as Array<Record<string, unknown>>;

    const periods = rows.map((r) => ({
      month: String(r['month'] ?? ''),
      year: String(r['year'] ?? ''),
      updatedAt: r['updated_at'] ? String(r['updated_at']) : null,
      createdAt: r['created_at'] ? String(r['created_at']) : null,
    }));

    return NextResponse.json({ data: periods });
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to list newsletter periods', details: String(err) },
      { status: 500 }
    );
  }
}


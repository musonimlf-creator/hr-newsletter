import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

// POST - Add a comment to an entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { entryId, user, content } = body as {
      entryId: string;
      user: string;
      content: string;
    };

    if (!entryId || !user || !content) {
      return NextResponse.json(
        { error: 'Entry ID, user, and content are required' },
        { status: 400 }
      );
    }

    const db = getDatabase();
    const result = db
      .prepare('INSERT INTO entry_comments (entry_id, user, content) VALUES (?, ?, ?)')
      .run(Number(entryId), user, content);

    return NextResponse.json({
      success: true,
      comment: {
        id: result.lastInsertRowid?.toString(),
        user,
        content,
        date: new Date().toISOString(),
      },
    });
  } catch (error: unknown) {
    console.error('Error adding comment:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: 'Failed to add comment', details: message },
      { status: 500 }
    );
  }
}


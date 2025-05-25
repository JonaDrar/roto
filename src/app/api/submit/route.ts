import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json({ error: 'Unsupported content type' }, { status: 415 });
    }

    const { name, percentage } = await req.json();

    if (!name || typeof percentage !== 'number') {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    await pool.query(
      'INSERT INTO quiz_results (name, rotura_percentage) VALUES ($1, $2)',
      [name, percentage]
    );

    return NextResponse.json({ message: 'Saved' });
  } catch (error) {
    console.error('[API:submit]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
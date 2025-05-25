import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
        name,
        rotura_percentage AS score,
        created_at
      FROM quiz_results
      WHERE created_at::date = CURRENT_DATE
      ORDER BY rotura_percentage DESC, created_at ASC
      LIMIT 50
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('[API:ranking]', error);
    return NextResponse.json({ error: 'Error fetching ranking' }, { status: 500 });
  }
}
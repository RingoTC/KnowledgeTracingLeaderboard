import { NextResponse } from 'next/server';
import { fetchLeaderboardData } from '@/utils/googleSheets';

export async function GET() {
  try {
    // Fetch data directly from Google Sheets
    const data = await fetchLeaderboardData();

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'No data found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
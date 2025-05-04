import { NextResponse } from 'next/server';
import { fetchLeaderboardData } from '@/utils/googleSheets';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    // Fetch data directly from Google Sheets
    const data = await fetchLeaderboardData();

    if (!data || data.models.length === 0) {
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

export async function POST() {
  try {
    // Revalidate the home page to clear the cache
    revalidatePath('/');
    
    return NextResponse.json({ 
      success: true,
      message: 'Cache cleared successfully. The next page load will fetch fresh data.'
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
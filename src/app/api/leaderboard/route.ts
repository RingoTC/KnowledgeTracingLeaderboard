import { createClient } from 'redis';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const redis = await createClient({
      url: process.env.REDIS_URL,
      password: process.env.REDIS_PASSWORD,
    }).connect();

    const data = await redis.get('leaderboard_data');
    await redis.quit();

    if (!data) {
      return NextResponse.json({ error: 'No data found' }, { status: 404 });
    }

    // Parse the data and return directly
    const parsedData = JSON.parse(data);
    return NextResponse.json(parsedData);
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
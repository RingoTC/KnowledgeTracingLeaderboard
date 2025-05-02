import { createClient } from 'redis';
import { NextResponse } from 'next/server';
import { ModelData, Dataset, DatasetScores } from '@/types';

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

    // Transform the data to match the expected ModelData type
    const rawData = JSON.parse(data);
    const transformedData: ModelData[] = rawData.map((item: any) => {
      // Initialize all datasets with null scores
      const datasets: Dataset[] = [
        "assist2009", "algebra2005", "bridge2006", "nips34", "xes3g5m",
        "ednet_small", "ednet_large", "statics2011", "assist2015", "poj"
      ];

      const modelData: ModelData = {
        model: item.model,
        assist2009: { accuracy: null, auc: null },
        algebra2005: { accuracy: null, auc: null },
        bridge2006: { accuracy: null, auc: null },
        nips34: { accuracy: null, auc: null },
        xes3g5m: { accuracy: null, auc: null },
        ednet_small: { accuracy: null, auc: null },
        ednet_large: { accuracy: null, auc: null },
        statics2011: { accuracy: null, auc: null },
        assist2015: { accuracy: null, auc: null },
        poj: { accuracy: null, auc: null }
      };

      // Update with actual data if available
      datasets.forEach(dataset => {
        if (item[dataset]) {
          modelData[dataset] = {
            accuracy: item[dataset].accuracy || null,
            auc: item[dataset].auc || null
          };
        }
      });

      return modelData;
    });

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching data from Redis:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
} 
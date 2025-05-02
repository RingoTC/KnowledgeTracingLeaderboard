import { ModelData } from "@/types";
import { GET } from "@/app/api/leaderboard/route";

export async function getServerSideData(): Promise<ModelData[]> {
    try {
        const response = await GET();
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching server-side data:', error);
        return [];
    }
} 
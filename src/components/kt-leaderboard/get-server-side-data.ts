import { ModelData, LeaderboardData } from "@/types";
import { GET } from "@/app/api/leaderboard/route";

export async function getServerSideData(): Promise<{ models: ModelData[], lastUpdated?: string }> {
    try {
        const response = await GET();
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data: LeaderboardData = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching server-side data:', error);
        return { models: [] };
    }
}
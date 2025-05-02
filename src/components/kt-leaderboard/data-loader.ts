import { ModelData } from "@/types";
import { cacheData } from "./cache-data";

export class DataLoader {
    private static instance: DataLoader;
    private cachedData: ModelData[] = cacheData();
    private apiData: ModelData[] | null = null;
    private isLoading: boolean = false;
    private isPreloaded: boolean = false;

    private constructor() {}

    public static getInstance(): DataLoader {
        if (!DataLoader.instance) {
            DataLoader.instance = new DataLoader();
        }
        return DataLoader.instance;
    }

    public static async preload(): Promise<void> {
        const instance = DataLoader.getInstance();
        if (!instance.isPreloaded) {
            await instance.loadApiData();
            instance.isPreloaded = true;
        }
    }

    public async loadData(initialData?: ModelData[]): Promise<ModelData[]> {
        // If we have initial data from SSR, use it
        if (initialData) {
            this.apiData = initialData;
            return initialData;
        }

        // Otherwise try to fetch from API
        try {
            const response = await fetch('/api/leaderboard');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const newData = await response.json();
            if (this.compareData(newData)) {
                this.apiData = newData;
            }
            return this.apiData || this.cachedData;
        } catch (error) {
            console.error('Error loading data:', error);
            return this.apiData || this.cachedData;
        }
    }

    private async loadApiData() {
        if (this.isLoading) return;
        this.isLoading = true;

        try {
            const response = await fetch('/api/leaderboard');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const newData = await response.json();
            if (this.compareData(newData)) {
                this.apiData = newData;
            }
        } catch (error) {
            console.error('Error loading API data:', error);
        } finally {
            this.isLoading = false;
        }
    }

    private compareData(newData: ModelData[]): boolean {
        // Compare the new data with cached data to determine if it's different
        return JSON.stringify(newData) !== JSON.stringify(this.cachedData);
    }
} 
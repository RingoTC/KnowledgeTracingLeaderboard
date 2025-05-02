import { ModelData, Dataset, DatasetScores } from "@/types";
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

    public async loadData(): Promise<ModelData[]> {
        // Return cached data immediately
        const initialData = this.cachedData;

        // Start loading API data in the background if not already preloaded
        if (!this.isPreloaded) {
            this.loadApiData();
        }

        return initialData;
    }

    private async loadApiData() {
        if (this.isLoading) return;
        this.isLoading = true;

        try {
            const response = await fetch('/api/leaderboard');
            if (!response.ok) {
                console.warn('Failed to fetch data from API, using cached data');
                return;
            }
            this.apiData = await response.json();
            
            // Compare and update if there are differences
            this.updateDataIfNeeded();
        } catch (error) {
            console.warn('Error loading API data, using cached data:', error);
        } finally {
            this.isLoading = false;
        }
    }

    private updateDataIfNeeded() {
        if (!this.apiData) return;

        const hasChanges = this.compareData(this.cachedData, this.apiData);
        if (hasChanges) {
            this.cachedData = this.apiData;
            // You can emit an event or use a callback here to notify components of the update
        }
    }

    private compareData(oldData: ModelData[], newData: ModelData[]): boolean {
        if (oldData.length !== newData.length) return true;

        for (let i = 0; i < oldData.length; i++) {
            const oldModel = oldData[i];
            const newModel = newData[i];

            if (oldModel.model !== newModel.model) return true;

            // Compare all dataset scores
            for (const dataset in oldModel) {
                if (dataset === 'model') continue;
                
                const oldScores = oldModel[dataset as Dataset] as DatasetScores;
                const newScores = newModel[dataset as Dataset] as DatasetScores;

                if (!oldScores && newScores) return true;
                if (oldScores && !newScores) return true;
                if (!oldScores && !newScores) continue;

                if (oldScores.accuracy?.value !== newScores.accuracy?.value ||
                    oldScores.auc?.value !== newScores.auc?.value) {
                    return true;
                }
            }
        }

        return false;
    }
} 
export type Score = {
    value: number;
    stdDev: number;
};

export type DatasetScores = {
    accuracy: Score | null;  // null when experiment is not completed
    auc: Score | null;      // null when experiment is not completed
    rmse: Score | null;     // null when experiment is not completed
};

export type Dataset = string;  // Dataset is just a string identifier

export type ModelData = {
    model: string;
    scores: {
        [dataset: string]: DatasetScores;
    };
};

export type LeaderboardData = {
    models: ModelData[];
    lastUpdated?: string; // ISO string of the last update time
};

export type SortConfig = {
    column: string | null;
    direction: "asc" | "desc";
};

export type Score = {
    value: number;
    stdDev: number;
};

export type DatasetScores = {
    accuracy: Score | null;
    auc: Score | null;
};

export type Dataset = 
    | "assist2009"
    | "algebra2005"
    | "bridge2006"
    | "nips34"
    | "xes3g5m"
    | "ednet_small"
    | "ednet_large"
    | "statics2011"
    | "assist2015"
    | "poj";

export type ModelData = {
    model: string;
} & {
    [K in Dataset]: DatasetScores;
};

export type SortConfig = {
    column: string | null;
    direction: "asc" | "desc";
};

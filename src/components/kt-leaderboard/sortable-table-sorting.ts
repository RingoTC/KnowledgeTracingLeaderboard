import { ModelData } from "@/types";

const METRICS_CONFIG = {
    accuracy: { isHigherBetter: true },
    auc: { isHigherBetter: true },
    rmse: { isHigherBetter: false }
};

export function sortModels(
    data: ModelData[],
    sortColumn: string | null,
    sortDirection: "asc" | "desc",
    calculateWins: (model: ModelData) => number
): ModelData[] {
    if (!sortColumn) return data;

    return [...data].sort((a, b) => {
        // Sort by model name
        if (sortColumn === 'model') {
            return sortDirection === 'asc'
                ? a.model.localeCompare(b.model)
                : b.model.localeCompare(a.model);
        }

        // Sort by wins
        if (sortColumn === 'wins') {
            const aWins = calculateWins(a);
            const bWins = calculateWins(b);
            return sortDirection === 'asc'
                ? aWins - bWins
                : bWins - aWins;
        }

        // Sort by dataset and metric
        // Handle dataset names that may contain underscores (like ednet_large, ednet_small)
        // The metric will always be the last part (accuracy, auc, or rmse)
        const parts = sortColumn.split('_');
        const metric = parts.pop() as "accuracy" | "auc" | "rmse";
        const dataset = parts.join('_'); // Rejoin the rest as the dataset name

        const aScore = a.scores[dataset]?.[metric]?.value ?? -Infinity;
        const bScore = b.scores[dataset]?.[metric]?.value ?? -Infinity;

        // For RMSE, lower is better, so we invert the sorting logic
        const isHigherBetter = METRICS_CONFIG[metric].isHigherBetter;
        const comparison = isHigherBetter ? bScore - aScore : aScore - bScore;

        return sortDirection === 'asc'
            ? comparison
            : -comparison;
    });
}

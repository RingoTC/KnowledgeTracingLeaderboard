import { ModelData } from "@/types";

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
        // The metric will always be the last part (accuracy or auc)
        const parts = sortColumn.split('_');
        const metric = parts.pop() as "accuracy" | "auc";
        const dataset = parts.join('_'); // Rejoin the rest as the dataset name

        // Add logging to debug dataset and metric extraction
        console.log(`Sorting by dataset: "${dataset}", metric: "${metric}" from column: "${sortColumn}"`);

        const aScore = a.scores[dataset]?.[metric]?.value ?? -Infinity;
        const bScore = b.scores[dataset]?.[metric]?.value ?? -Infinity;

        return sortDirection === 'asc'
            ? aScore - bScore
            : bScore - aScore;
    });
}

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
        const [dataset, metric] = sortColumn.split('_') as [keyof ModelData, "accuracy" | "auc"];
        const aDataset = a[dataset];
        const bDataset = b[dataset];

        if (typeof aDataset === 'object' && typeof bDataset === 'object') {
            const aScore = aDataset[metric]?.value ?? -Infinity;
            const bScore = bDataset[metric]?.value ?? -Infinity;
            return sortDirection === 'asc'
                ? aScore - bScore
                : bScore - aScore;
        }

        return 0;
    });
}

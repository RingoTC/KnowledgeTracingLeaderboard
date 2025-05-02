import { Dataset, ModelData } from "@/types";

type WinsCellProps = {
    model: ModelData;
    datasets: Dataset[];
    metrics: ("accuracy" | "auc")[];
    bestScores: Map<string, number>;
};

export function WinsCell({ model, datasets, metrics, bestScores }: WinsCellProps) {
    const wins = datasets.reduce((total, dataset) => {
        return total + metrics.reduce((metricTotal, metric) => {
            const key = `${dataset}_${metric}`;
            const score = model[dataset][metric]?.value;
            if (score != null && score === bestScores.get(key)) {
                return metricTotal + 1;
            }
            return metricTotal;
        }, 0);
    }, 0);

    return (
        <div className="text-center font-medium bg-green-50 dark:bg-green-950">
            {wins}
        </div>
    );
}

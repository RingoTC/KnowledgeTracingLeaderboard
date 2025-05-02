"use client";

import { useState } from "react";
import { SortableTable } from "./sortable-table";
import { ScoreCell } from "./score-cell";
import { sortModels } from "./sortable-table-sorting";
import { Dataset, ModelData, Score } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/@/components/ui/select";

type DatasetInfo = {
    name: string;
    key: Dataset;
};

type MetricInfo = {
    name: string;
    key: "accuracy" | "auc";
};

type KTLeaderboardProps = {
    data: ModelData[];
};

export function KTLeaderboard({ data }: KTLeaderboardProps) {
    const [sortConfig, setSortConfig] = useState<{
        column: string | null;
        direction: "asc" | "desc";
    }>({ column: 'assist2009_auc', direction: "desc" });
    
    const [selectedMetric, setSelectedMetric] = useState<"accuracy" | "auc">("auc");

    const datasets: DatasetInfo[] = [
        { name: "ASSIST2009", key: "assist2009" },
        { name: "Algebra2005", key: "algebra2005" },
        { name: "Bridge2006", key: "bridge2006" },
        { name: "NIPS34", key: "nips34" },
        { name: "XES3G5M", key: "xes3g5m" },
        { name: "EdNet-small", key: "ednet_small" },
        { name: "EdNet-large", key: "ednet_large" },
        { name: "Statics2011", key: "statics2011" },
        { name: "ASSIST2015", key: "assist2015" },
        { name: "POJ", key: "poj" }
    ];

    // Define metrics but only use the selected one in the table
    const metrics: MetricInfo[] = [
        { name: "Accuracy", key: "accuracy" },
        { name: "AUC", key: "auc" }
    ];
    
    // Filter metrics to only include the selected one
    const selectedMetrics = metrics.filter(metric => metric.key === selectedMetric);

    const handleSort = (column: string) => {
        setSortConfig((prevConfig) => ({
            column,
            direction: prevConfig.column === column && prevConfig.direction === 'desc'
                ? 'asc'
                : 'desc',
        }));
    };

    const getBestScores = () => {
        const bestScores = new Map<string, number>();
        const secondBestScores = new Map<string, number>();

        datasets.forEach(dataset => {
            metrics.forEach(metric => {
                const key = `${dataset.key}_${metric.key}`;
                const scores = data
                    .map(model => model[dataset.key][metric.key])
                    .filter((score): score is Score => score !== null)
                    .map(score => score.value)
                    .sort((a, b) => b - a);

                if (scores.length > 0) {
                    bestScores.set(key, scores[0]);
                    if (scores.length > 1) {
                        secondBestScores.set(key, scores[1]);
                    }
                }
            });
        });

        return { bestScores, secondBestScores };
    };

    const { bestScores, secondBestScores } = getBestScores();

    const renderCell = (model: ModelData, dataset: Dataset, metric: MetricInfo) => {
        const score = model[dataset][metric.key];
        if (!score) return <div className="text-center text-gray-400">-</div>;

        const scoreKey = `${dataset}_${metric.key}`;
        const isHighest = score.value === bestScores.get(scoreKey);
        const isSecondHighest = score.value === secondBestScores.get(scoreKey);

        return (
            <div className={`
                text-center
                ${isHighest ? "font-bold text-green-600 dark:text-green-400" : ""}
                ${isSecondHighest ? "underline" : ""}
            `}>
                <ScoreCell score={score} />
            </div>
        );
    };
    
    const sortedData = sortModels(data, sortConfig.column, sortConfig.direction);

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col items-center gap-2 mb-8">
                    <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
                        Knowledge Tracing Leaderboard
                    </h1>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>Metric:</span>
                        <Select
                            value={selectedMetric}
                            onValueChange={(value: "accuracy" | "auc") => setSelectedMetric(value)}
                        >
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Select metric" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="auc">AUC</SelectItem>
                                <SelectItem value="accuracy">Accuracy</SelectItem>
                            </SelectContent>
                        </Select>
                        <span className="text-gray-400">•</span>
                        <span>Click on column headers to sort</span>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                    <SortableTable
                        data={sortedData}
                        sortConfig={sortConfig}
                        onSort={handleSort}
                        datasets={datasets}
                        metrics={selectedMetrics}
                        renderCell={renderCell}
                    />
                </div>
            </div>
        </div>
    );
}

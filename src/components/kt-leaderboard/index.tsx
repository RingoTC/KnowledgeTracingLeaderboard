"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { SortableTable } from "./sortable-table";
import { ScoreCell } from "./score-cell";
import { sortModels } from "./sortable-table-sorting";
import { Dataset, ModelData, Score, LeaderboardData } from "@/types";
import { DataLoader } from "./data-loader";
import { Footnote } from "./footnote";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Constants
const METRICS = [
  { name: "Accuracy", key: "accuracy" as const },
  { name: "AUC", key: "auc" as const }
] as const;

type MetricInfo = {
  name: string;
  key: "accuracy" | "auc";
};

interface KTLeaderboardProps {
  initialData?: LeaderboardData;
}

// Custom hook for data management
const useLeaderboardData = (initialData?: LeaderboardData) => {
  const [data, setData] = useState<ModelData[]>(initialData?.models || []);
  // Use only the state value without the setter since we don't need to update it
  const [lastUpdated] = useState<string | undefined>(initialData?.lastUpdated);
  const [selectedMetric, setSelectedMetric] = useState<"accuracy" | "auc">("auc");

  useEffect(() => {
    const loadData = async () => {
      const dataLoader = DataLoader.getInstance();
      const newData = await dataLoader.loadData(initialData?.models);
      setData(newData);
    };

    // Only load data if we don't have initial data from SSR
    if (!initialData) {
      loadData();
    }
  }, [initialData]);

  return { data, lastUpdated, selectedMetric, setSelectedMetric };
};

// Custom hook for sorting
const useSorting = (initialColumn = 'wins', initialDirection: "asc" | "desc" = "desc") => {
  const [sortConfig, setSortConfig] = useState<{
    column: string | null;
    direction: "asc" | "desc";
  }>({ column: initialColumn, direction: initialDirection });

  const handleSort = useCallback((column: string) => {
    setSortConfig((prevConfig) => ({
      column,
      direction: prevConfig.column === column && prevConfig.direction === 'desc'
        ? 'asc'
        : 'desc',
    }));
  }, []);

  return { sortConfig, handleSort };
};

// Custom hook for score calculations
const useScoreCalculations = (data: ModelData[], selectedMetric: "accuracy" | "auc") => {
  const datasets = useMemo(() =>
    data.length > 0 ? Object.keys(data[0].scores) : [],
    [data]
  );

  const { bestScores, secondBestScores } = useMemo(() => {
    const bestScores = new Map<string, number>();
    const secondBestScores = new Map<string, number>();

    datasets.forEach(dataset => {
      METRICS.forEach(metric => {
        const key = `${dataset}_${metric.key}`;
        const scores = data
          .map(model => model.scores[dataset]?.[metric.key])
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
  }, [data, datasets]);

  const calculateWins = useCallback((model: ModelData) => {
    let wins = 0;
    datasets.forEach(dataset => {
      const datasetScores = model.scores[dataset];
      if (!datasetScores) return;

      const score = datasetScores[selectedMetric];
      if (score) {
        const scoreKey = `${dataset}_${selectedMetric}`;
        if (score.value === bestScores.get(scoreKey)) {
          wins++;
        }
      }
    });
    return wins;
  }, [datasets, selectedMetric, bestScores]);

  return { datasets, bestScores, secondBestScores, calculateWins };
};

// Cell renderer component
const ScoreCellRenderer = ({
  model,
  dataset,
  metric,
  bestScores,
  secondBestScores
}: {
  model: ModelData;
  dataset: Dataset;
  metric: MetricInfo;
  bestScores: Map<string, number>;
  secondBestScores: Map<string, number>;
}) => {
  const datasetScores = model.scores[dataset];
  if (!datasetScores) return <div className="text-center text-gray-400">-</div>;

  const score = datasetScores[metric.key];
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

export function KTLeaderboard({ initialData }: KTLeaderboardProps) {
  const { data, lastUpdated, selectedMetric, setSelectedMetric } = useLeaderboardData(initialData);
  const { sortConfig, handleSort } = useSorting();
  const { datasets, bestScores, secondBestScores, calculateWins } = useScoreCalculations(data, selectedMetric);

  const selectedMetrics = useMemo(() =>
    METRICS.filter(metric => metric.key === selectedMetric).map(metric => ({
      name: metric.name,
      key: metric.key
    } as MetricInfo)),
    [selectedMetric]
  );

  const sortedData = useMemo(() =>
    sortModels(data, sortConfig.column, sortConfig.direction, calculateWins),
    [data, sortConfig, calculateWins]
  );

  const renderCell = useCallback((model: ModelData, dataset: Dataset, metric: MetricInfo) => (
    <ScoreCellRenderer
      model={model}
      dataset={dataset}
      metric={metric}
      bestScores={bestScores}
      secondBestScores={secondBestScores}
    />
  ), [bestScores, secondBestScores]);

  return (
    <div className="space-y-6">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold mb-4">
          <span className="mr-2">💯</span>
          Knowledge Tracing Leaderboard
        </h1>
        <div className="flex items-center justify-center gap-4">
          <p className="text-gray-600 dark:text-gray-400">
            Compare model performance across different datasets and metrics
          </p>
          <Select
            value={selectedMetric}
            onValueChange={(value: "accuracy" | "auc") => setSelectedMetric(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              {METRICS.map(metric => (
                <SelectItem key={metric.key} value={metric.key}>
                  {metric.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <SortableTable
        data={sortedData}
        sortConfig={sortConfig}
        onSort={handleSort}
        datasets={datasets}
        metrics={selectedMetrics}
        renderCell={renderCell}
        calculateWins={calculateWins}
      />
      <Footnote lastUpdated={lastUpdated} />
    </div>
  );
}

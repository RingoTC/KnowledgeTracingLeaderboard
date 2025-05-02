import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Dataset, ModelData } from "@/types";

type DatasetInfo = {
    name: string;
    key: Dataset;
};

type MetricInfo = {
    name: string;
    key: "accuracy" | "auc";
};

type SortableTableProps = {
    data: ModelData[];
    sortConfig: {
        column: string | null;
        direction: "asc" | "desc";
    };
    onSort: (column: string) => void;
    datasets: DatasetInfo[];
    metrics: MetricInfo[];
    renderCell: (model: ModelData, dataset: Dataset, metric: MetricInfo) => React.ReactNode;
};

export function SortableTable({
    data,
    sortConfig,
    onSort,
    datasets,
    metrics,
    renderCell
}: SortableTableProps) {
    const SortIcon = ({ column }: { column: string }) => {
        if (sortConfig.column !== column) {
            return null;
        }
        return (
            <span className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                {sortConfig.direction === 'desc' ? (
                    <ChevronDown className="h-3 w-3" />
                ) : (
                    <ChevronUp className="h-3 w-3" />
                )}
            </span>
        );
    };

    return (
        <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800">
                    <TableHead
                        className="cursor-pointer relative pr-5 min-w-[120px] text-center font-semibold text-gray-900 dark:text-white"
                        onClick={() => onSort('model')}
                    >
                        Model/Dataset <SortIcon column="model" />
                    </TableHead>
                    {metrics.map(metric => (
                        datasets.map(dataset => (
                            <TableHead
                                key={`${dataset.key}_${metric.key}`}
                                className="cursor-pointer relative pr-5 min-w-[100px] text-center font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                onClick={() => onSort(`${dataset.key}_${metric.key}`)}
                            >
                                {dataset.name} <SortIcon column={`${dataset.key}_${metric.key}`} />
                            </TableHead>
                        ))
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {data.map((model, index) => (
                    <TableRow 
                        key={model.model}
                        className={`
                            transition-colors
                            ${index % 2 === 0 
                                ? 'bg-white dark:bg-gray-900' 
                                : 'bg-gray-50 dark:bg-gray-800'
                            }
                            hover:bg-gray-100 dark:hover:bg-gray-700
                        `}
                    >
                        <TableCell className="font-medium text-center text-gray-900 dark:text-white py-4">
                            {model.model}
                        </TableCell>
                        {metrics.map(metric => (
                            datasets.map(dataset => (
                                <TableCell 
                                    key={`${dataset.key}_${metric.key}`} 
                                    className="text-center min-w-[100px] py-4"
                                >
                                    {renderCell(model, dataset.key, metric)}
                                </TableCell>
                            ))
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

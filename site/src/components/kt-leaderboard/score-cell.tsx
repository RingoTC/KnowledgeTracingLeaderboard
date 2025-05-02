import { Score } from "@/types";

type ScoreCellProps = {
    score: Score | null;
};

export function ScoreCell({ score }: ScoreCellProps) {
    if (!score) return <div className="text-center text-gray-400 dark:text-gray-500">-</div>;

    return (
        <div className="text-center whitespace-nowrap text-gray-900 dark:text-white">
            {score.value.toFixed(4)}
        </div>
    );
}

import { Dataset, ModelData, Score } from "@/types";
import { leaderboardData } from "@/data/generated";

function parseScoreString(str: string): Score | null {
    if (str === '-') return null;
    const [value, stdDev] = str.split('±').map(Number);
    return { value, stdDev };
}

function normalizeDatasetKey(key: string): Dataset {
    const mapping: { [key: string]: Dataset } = {
        'ASSIST2009': 'assist2009',
        'Algebra2005': 'algebra2005',
        'Bridge2006': 'bridge2006',
        'NIPS34': 'nips34',
        'XES3G5M': 'xes3g5m',
        'EdNet-small': 'ednet_small',
        'EdNet-large': 'ednet_large',
        'Statics2011': 'statics2011',
        'ASSIST2015': 'assist2015',
        'POJ': 'poj'
    };
    return mapping[key] as Dataset;
}

export function parseCSVData(csvContent: string): ModelData[] {
    const lines = csvContent.split('\n').filter(line => line.trim());
    const models: ModelData[] = [];

    // Process each line starting from index 2 (skipping headers)
    for (let i = 2; i < lines.length; i += 2) {
        const accuracyLine = lines[i].split(',');
        const aucLine = lines[i + 1].split(',');
        
        const modelName = accuracyLine[0];
        const modelData: Partial<ModelData> = { model: modelName };

        // Process datasets
        const datasetKeys = [
            'ASSIST2009', 'Algebra2005', 'Bridge2006', 'NIPS34', 
            'XES3G5M', 'EdNet-small', 'EdNet-large', 'Statics2011', 
            'ASSIST2015', 'POJ'
        ];

        datasetKeys.forEach((key, idx) => {
            const normalizedKey = normalizeDatasetKey(key);
            modelData[normalizedKey] = {
                accuracy: parseScoreString(accuracyLine[idx + 1]),
                auc: parseScoreString(aucLine[idx + 11]) // +11 to skip model name and align with AUC columns
            };
        });

        models.push(modelData as ModelData);
    }

    return models;
}

export function loadData(): ModelData[] {
    return leaderboardData;
}

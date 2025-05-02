import { ModelData, DatasetScores } from "@/types";

export const cacheData = (): ModelData[] => {
    const rawData = [{"model":"DKT","assist2009":{"accuracy":{"value":0.7244,"stdDev":0.0014},"auc":{"value":0.7541,"stdDev":0.0011}},"algebra2005":{"accuracy":{"value":0.8097,"stdDev":0.0005},"auc":{"value":0.8149,"stdDev":0.0011}},"bridge2006":{"accuracy":{"value":0.8553,"stdDev":0.0002},"auc":{"value":0.8015,"stdDev":0.0008}},"nips34":{"accuracy":{"value":0.7032,"stdDev":0.0004},"auc":{"value":0.7689,"stdDev":0.0002}},"xes3g5m":{"accuracy":{"value":0.8173,"stdDev":0.0002},"auc":{"value":0.7852,"stdDev":0.0006}},"ednet_small":{"accuracy":{"value":0.6462,"stdDev":0.0028},"auc":{"value":0.6133,"stdDev":0.0006}},"ednet_large":{"accuracy":{"value":0.6603,"stdDev":0.0033},"auc":{"value":0.642,"stdDev":0.0028}},"statics2011":{"accuracy":{"value":0.7969,"stdDev":0.0006},"auc":{"value":0.8222,"stdDev":0.0013}},"assist2015":{"accuracy":{"value":0.7503,"stdDev":0.0003},"auc":{"value":0.7271,"stdDev":0.0005}},"poj":{"accuracy":{"value":0.6328,"stdDev":0.002},"auc":{"value":0.6089,"stdDev":0.0009}}}];
    
    // Transform the data to match the new ModelData structure
    return rawData.map(item => {
        const modelData: ModelData = {
            model: item.model,
            scores: {} as Record<string, DatasetScores>
        };

        // Move all dataset scores into the scores object
        Object.keys(item).forEach(key => {
            if (key !== 'model') {
                modelData.scores[key] = item[key as keyof typeof item] as DatasetScores;
            }
        });

        return modelData;
    });
}
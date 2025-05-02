import { promises as fs } from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

async function generateData() {
  const csvPath = path.join(process.cwd(), 'src/data/result.csv');
  const outputPath = path.join(process.cwd(), 'src/data/generated.ts');
  
  console.log('Reading CSV from:', csvPath);
  const fileContent = await fs.readFile(csvPath, 'utf-8');
  const lines = fileContent.split('\n').filter(line => line.trim());

  // 找到 Accuracy 和 AUC 的行索引
  const accuracyIndex = lines.findIndex(line => line.startsWith('Accuracy'));
  const aucIndex = lines.findIndex(line => line.startsWith('AUC'));

  // 获取列名（数据集名称）
  const columnNames = lines[accuracyIndex + 1].split(',').map(name => name.trim());
  console.log('Column names after trim:', columnNames);
  const [_, ...datasetNames] = columnNames; // 第一列是 "Model"
  console.log('Dataset names after trim:', datasetNames);

  // 解析 Accuracy 数据
  const accuracyData = parse(
    lines.slice(accuracyIndex + 2, aucIndex).join('\n'),
    {
      columns: columnNames,
      skip_empty_lines: true,
      trim: true,
      delimiter: ','
    }
  );
  console.log('First accuracy record:', accuracyData[0]);

  // 解析 AUC 数据
  const aucData = parse(
    lines.slice(aucIndex + 2).join('\n'),
    {
      columns: columnNames,
      skip_empty_lines: true,
      trim: true,
      delimiter: ','
    }
  );
  console.log('First AUC record:', aucData[0]);

  const columnToDatasetMap = {
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
  } as const;

  type DatasetKey = typeof columnToDatasetMap[keyof typeof columnToDatasetMap];
  type DatasetValue = {
    accuracy: { value: number; stdDev: number } | null;
    auc: { value: number; stdDev: number } | null;
  };
  type ModelData = {
    model: string;
  } & {
    [K in DatasetKey]: DatasetValue;
  };

  const models: ModelData[] = [];

  // 处理每个模型的数据
  for (const accuracyRecord of accuracyData) {
    const modelName = accuracyRecord.Model;
    console.log(`Processing model: ${modelName}`);
    const modelData = {
      model: modelName,
      assist2009: { accuracy: null, auc: null },
      algebra2005: { accuracy: null, auc: null },
      bridge2006: { accuracy: null, auc: null },
      nips34: { accuracy: null, auc: null },
      xes3g5m: { accuracy: null, auc: null },
      ednet_small: { accuracy: null, auc: null },
      ednet_large: { accuracy: null, auc: null },
      statics2011: { accuracy: null, auc: null },
      assist2015: { accuracy: null, auc: null },
      poj: { accuracy: null, auc: null },
    } as ModelData;

    // 处理 accuracy 数据
    for (const [csvColumn, datasetKey] of Object.entries(columnToDatasetMap)) {
      const value = accuracyRecord[csvColumn];
      console.log(`Processing ${datasetKey} accuracy for ${modelName}:`, value);
      if (value && value !== '-') {
        try {
          const [score, stdDev] = value.split('±').map((v: string): number => Number(v.trim()));
          modelData[datasetKey].accuracy = { value: score, stdDev };
          console.log(`Successfully parsed ${datasetKey} accuracy for ${modelName}:`, { value: score, stdDev });
        } catch (error) {
          console.error(`Error parsing accuracy data for ${modelName} in ${datasetKey}:`, error, value);
        }
      }
    }

    // 处理 AUC 数据
    const aucRecord = aucData.find((record: any) => record.Model === modelName);
    if (aucRecord) {
      for (const [csvColumn, datasetKey] of Object.entries(columnToDatasetMap)) {
        const value = aucRecord[csvColumn];
        console.log(`Processing ${datasetKey} AUC for ${modelName}:`, value);
        if (value && value !== '-') {
          try {
            const [score, stdDev] = value.split('±').map((v: string): number => Number(v.trim()));
            modelData[datasetKey].auc = { value: score, stdDev };
            console.log(`Successfully parsed ${datasetKey} AUC for ${modelName}:`, { value: score, stdDev });
          } catch (error) {
            console.error(`Error parsing AUC data for ${modelName} in ${datasetKey}:`, error, value);
          }
        }
      }
    }

    models.push(modelData);
  }

  console.log(`Parsed ${models.length} models`);

  const output = `// This file is auto-generated. DO NOT EDIT.
import { ModelData } from "@/types";

export const leaderboardData: ModelData[] = ${JSON.stringify(models, null, 2)};
`;

  await fs.writeFile(outputPath, output, 'utf-8');
  console.log('Generated data file at:', outputPath);
}

generateData().catch(console.error); 
import { createClient } from 'redis';
import * as XLSX from 'xlsx';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { ModelData, Score, DatasetScores } from '../types/index';

// 加载环境变量
dotenv.config({ path: path.join(process.cwd(), '.env.development.local') });

interface BenchmarkData {
  Model: string;
  [key: string]: string | number;
}

function parseScoreString(str: string | number): Score | null {
  if (str === '-' || str === '') return null;
  if (typeof str === 'number') return { value: str, stdDev: 0 };
  const [value, stdDev] = str.split('±').map(Number);
  return { value, stdDev };
}

function normalizeDatasetName(name: string): string {
  return name.toLowerCase().replace(/[\s-]/g, '_');
}

async function uploadToRedis() {
  try {
    // 检查环境变量
    console.log('REDIS_URL:', process.env.REDIS_URL ? 'Set' : 'Not set');
    console.log('Current directory:', process.cwd());
    
    // 创建Redis客户端
    const redisClient = createClient({
      url: process.env.REDIS_URL,
    });

    // 连接到Redis
    await redisClient.connect();
    console.log('Connected to Redis');

    // 读取Excel文件
    const filePath = path.join(process.cwd(), 'src/data/benchmark.xlsx');
    console.log('Reading file from:', filePath);
    const workbook = XLSX.readFile(filePath);
    
    // 获取ACC和AUC工作表
    const accWorksheet = workbook.Sheets['ACC'];
    const aucWorksheet = workbook.Sheets['AUC'];
    
    // 将工作表转换为JSON
    const accData = XLSX.utils.sheet_to_json<BenchmarkData>(accWorksheet);
    const aucData = XLSX.utils.sheet_to_json<BenchmarkData>(aucWorksheet);

    // 获取所有数据集名称（排除Model列）
    const datasetNames = Object.keys(accData[0]).filter(key => key !== 'Model');
    console.log('Dataset names:', datasetNames);

    // 处理数据
    const processedData: ModelData[] = accData.map((accItem, index) => {
      const modelName = accItem.Model.trim();
      const aucItem = aucData[index];
      const modelData: ModelData = { 
        model: modelName,
        scores: {} as Record<string, DatasetScores>
      };

      // 为每个数据集创建结构
      datasetNames.forEach(dataset => {
        const accScore = accItem[dataset];
        const aucScore = aucItem[dataset];
        const normalizedDataset = normalizeDatasetName(dataset);
        
        modelData.scores[normalizedDataset] = {
          accuracy: parseScoreString(accScore),
          auc: parseScoreString(aucScore)
        };
      });

      return modelData;
    });

    // 将数据上传到Redis
    await redisClient.set('leaderboard_data', JSON.stringify(processedData));

    console.log('Data uploaded to Redis successfully');
    await redisClient.quit();
  } catch (error) {
    console.error('Error uploading data to Redis:', error);
    process.exit(1);
  }
}

// 执行上传
uploadToRedis(); 
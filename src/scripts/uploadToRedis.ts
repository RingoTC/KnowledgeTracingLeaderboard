import { createClient } from 'redis';
import XLSX from 'xlsx';
import * as path from 'path';
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config({ path: path.join(process.cwd(), '.env.development.local') });

interface BenchmarkData {
  Model: string;
  [key: string]: string | number;
}

function parseScoreString(str: string): { value: number; stdDev: number } | null {
  if (str === '-') return null;
  const [value, stdDev] = str.split('±').map(Number);
  return { value, stdDev };
}

function normalizeDatasetName(name: string): string {
  // 移除空格和特殊字符，转换为小写
  return name.toLowerCase().replace(/[-\s]/g, '_');
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
    
    // 获取第一个工作表
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    
    // 将工作表转换为JSON
    const data = XLSX.utils.sheet_to_json<BenchmarkData>(worksheet);

    // 获取所有数据集名称（排除Model列）
    const datasetNames = Object.keys(data[0]).filter(key => key !== 'Model');
    console.log('Dataset names:', datasetNames);

    // 处理数据
    const processedData = data.map(item => {
      const modelName = item.Model.trim();
      const modelData: any = { model: modelName };

      // 为每个数据集创建结构
      datasetNames.forEach(dataset => {
        const score = item[dataset];
        if (typeof score === 'string') {
          const parsedScore = parseScoreString(score);
          const normalizedDataset = normalizeDatasetName(dataset);
          modelData[normalizedDataset] = {
            accuracy: parsedScore,
            auc: parsedScore // 这里假设每个数据集都有相同的accuracy和auc值
          };
        }
      });

      return modelData;
    });

    // 将数据上传到Redis
    await redisClient.set('leaderboard_data', JSON.stringify(processedData));

    console.log('Data uploaded to Redis successfully');

    // 关闭Redis连接
    await redisClient.quit();
  } catch (error) {
    console.error('Error:', error);
  }
}

// 执行上传
uploadToRedis(); 
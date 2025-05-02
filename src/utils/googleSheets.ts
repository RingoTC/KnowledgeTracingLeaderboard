import { google } from 'googleapis';
import { GoogleAuth, OAuth2Client } from 'google-auth-library';
import { sheets_v4 } from 'googleapis';
import { ModelData, Score, DatasetScores, LeaderboardData } from '@/types';

// Helper functions
function parseScoreString(str: string | number): Score | null {
  if (str === '-' || str === '') return null;
  if (typeof str === 'number') return { value: str, stdDev: 0 };
  const [value, stdDev] = str.split('±').map(Number);
  return { value, stdDev };
}

function normalizeDatasetName(name: string): string {
  return name.toLowerCase().replace(/[\s-]/g, '_');
}

interface BenchmarkData {
  Model: string;
  [key: string]: string | number;
}

/**
 * Authorize with Google Sheets API using service account credentials
 */
async function authorize() {
  try {
    // Use environment variables for service account credentials
    const credentials = {
      type: 'service_account',
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
      universe_domain: 'googleapis.com'
    };

    return new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
    });
  } catch (error) {
    console.error('Error authorizing with Google Sheets API:', error);
    throw error;
  }
}

/**
 * Get all sheet names from a Google Spreadsheet
 */
async function getSheetNames(auth: GoogleAuth | OAuth2Client, spreadsheetId: string): Promise<string[]> {
  const sheets = google.sheets({ version: 'v4', auth });
  const response = await sheets.spreadsheets.get({
    spreadsheetId,
  });
  return response.data.sheets?.map(sheet => sheet.properties?.title || '') || [];
}

/**
 * Get the current time as ISO string to use as last updated time
 * Since we can't directly get the last modified time from the Sheets API without additional permissions,
 * we'll use the current time when the data was fetched as an approximation
 */
function getCurrentTimeAsISOString(): string {
  return new Date().toISOString();
}

/**
 * Get data from a specific sheet in a Google Spreadsheet
 */
async function getSheetData(auth: GoogleAuth | OAuth2Client, spreadsheetId: string, range: string): Promise<sheets_v4.Schema$ValueRange['values']> {
  const sheets = google.sheets({ version: 'v4', auth });
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });
  return response.data.values || [];
}

/**
 * Convert row data to objects with headers as keys
 */
function convertRowsToObjects(rows: sheets_v4.Schema$ValueRange['values']): BenchmarkData[] {
  if (!rows || rows.length === 0) {
    return [];
  }

  const headers = rows[0] as string[];
  return rows.slice(1).map(row => {
    const obj: BenchmarkData = { Model: '' };
    headers.forEach((header: string, index: number) => {
      obj[header] = row[index] || '';
    });
    return obj;
  });
}

/**
 * Fetch leaderboard data directly from Google Sheets
 */
export async function fetchLeaderboardData(): Promise<LeaderboardData> {
  try {
    // Get spreadsheet ID from environment variable
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    if (!spreadsheetId) {
      throw new Error('Google Spreadsheet ID not found in environment variables');
    }

    // Authorize with Google Sheets API
    const auth = await authorize();

    // Get all sheet names
    const sheetNames = await getSheetNames(auth, spreadsheetId);

    if (sheetNames.length === 0) {
      throw new Error('No sheets found in the spreadsheet');
    }

    // Use the first sheet
    const sheetName = sheetNames[0];

    // Get sheet data
    const rows = await getSheetData(auth, spreadsheetId, `${sheetName}`);

    if (!rows || rows.length === 0) {
      throw new Error('No data found in the spreadsheet');
    }

    // Use current time as the last updated time
    const lastModified = getCurrentTimeAsISOString();

    // Convert rows to objects
    const data = convertRowsToObjects(rows);

    // Get all dataset names (excluding Model column)
    const datasetNames = Object.keys(data[0]).filter(key => key !== 'Model');

    // Process data
    const processedData: ModelData[] = data.map((item: BenchmarkData) => {
      const modelName = item.Model.toString().trim();
      const modelData: ModelData = {
        model: modelName,
        scores: {} as Record<string, DatasetScores>
      };

      // Create structure for each dataset
      datasetNames.forEach(dataset => {
        const score = item[dataset];
        const normalizedDataset = normalizeDatasetName(dataset);

        // Assume all values are AUC values
        modelData.scores[normalizedDataset] = {
          accuracy: null, // No accuracy data
          auc: parseScoreString(score)
        };
      });

      return modelData;
    });

    return {
      models: processedData,
      lastUpdated: lastModified
    };
  } catch (error) {
    console.error('Error fetching leaderboard data from Google Sheets:', error);
    return { models: [] };
  }
}

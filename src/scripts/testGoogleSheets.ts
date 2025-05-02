import { fetchLeaderboardData } from '../utils/googleSheets';

async function testGoogleSheets() {
  console.log('Testing Google Sheets data fetching...');
  
  try {
    const data = await fetchLeaderboardData();
    console.log('Data fetched successfully!');
    
    // Check if we have models
    console.log(`Number of models: ${data.models.length}`);
    
    if (data.models.length > 0) {
      // Check the first model's data structure
      const firstModel = data.models[0];
      console.log(`First model: ${firstModel.model}`);
      
      // Check if we have both accuracy and AUC data
      const datasets = Object.keys(firstModel.scores);
      console.log(`Datasets for first model: ${datasets.join(', ')}`);
      
      if (datasets.length > 0) {
        const firstDataset = datasets[0];
        console.log(`First dataset scores for ${firstModel.model}:`, firstModel.scores[firstDataset]);
      }
    }
    
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Error testing Google Sheets:', error);
  }
}

// Run the test
testGoogleSheets();

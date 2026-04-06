const { databases } = require('../config/appwrite');
const { ID } = require('node-appwrite');
const { spawnSync } = require('child_process');
const path = require('path');

exports.predictPrice = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: 'Missing product URL' });
  }

  try {
    // Call Python ML Script
    const pythonPath = 'python'; // or 'python3' depending on environment
    const scriptPath = path.join(__dirname, '../ml/predict.py');
    
    const result = spawnSync(pythonPath, [scriptPath, url], { encoding: 'utf8' });
    
    if (result.error) {
        throw new Error(`Failed to start prediction script: ${result.error.message}`);
    }

    if (result.status !== 0) {
        throw new Error(`Prediction script failed: ${result.stderr}`);
    }

    let prediction;
    try {
        prediction = JSON.parse(result.stdout);
    } catch (e) {
        throw new Error(`Failed to parse prediction results: ${result.stdout}`);
    }

    if (prediction.error) {
        throw new Error(prediction.error);
    }

    // Store in Appwrite Database
    const log = await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_SEARCH_LOG_COLLECTION_ID,
      ID.unique(),
      {
        userId: req.userId,
        query: prediction.name || "",
        url: url,
        predictionResult: JSON.stringify(prediction),
        searchedAt: new Date().toISOString()
      }
    );

    res.status(200).json({
      message: 'Prediction successful',
      prediction: prediction,
      logId: log.$id
    });

  } catch (err) {
    console.error('Prediction Error:', err);
    res.status(500).json({ message: 'Error performing prediction', error: err.message });
  }
};

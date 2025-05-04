// ES Modules version of the download script
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create directories
const modelDir = path.join(__dirname, 'public', 'models');
const directories = [
  path.join(modelDir),
  path.join(modelDir, 'tiny_face_detector'),
  path.join(modelDir, 'face_expression'),
  path.join(modelDir, 'face_landmark_68')
];

// Create directories if they don't exist
directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Files to download
const modelFiles = [
  {
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json',
    dest: path.join(modelDir, 'tiny_face_detector', 'tiny_face_detector_model-weights_manifest.json')
  },
  {
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-shard1',
    dest: path.join(modelDir, 'tiny_face_detector', 'tiny_face_detector_model-shard1')
  },
  {
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_expression_model-weights_manifest.json',
    dest: path.join(modelDir, 'face_expression', 'face_expression_model-weights_manifest.json')
  },
  {
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_expression_model-shard1',
    dest: path.join(modelDir, 'face_expression', 'face_expression_model-shard1')
  },
  {
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-weights_manifest.json',
    dest: path.join(modelDir, 'face_landmark_68', 'face_landmark_68_model-weights_manifest.json')
  },
  {
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-shard1',
    dest: path.join(modelDir, 'face_landmark_68', 'face_landmark_68_model-shard1')
  }
];

// Download function
const downloadFile = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    
    console.log(`Downloading ${url} to ${dest}`);
    
    const request = https.get(url, { 
      rejectUnauthorized: false // Skip certificate validation for this script
    }, response => {
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${dest}`);
        resolve();
      });
    });
    
    request.on('error', err => {
      fs.unlink(dest, () => {}); // Delete the file on error
      console.error(`Error downloading ${url}: ${err.message}`);
      reject(err);
    });
    
    file.on('error', err => {
      fs.unlink(dest, () => {}); // Delete the file on error
      console.error(`Error writing to ${dest}: ${err.message}`);
      reject(err);
    });
  });
};

// Download all files
const downloadAll = async () => {
  console.log('Starting download of face-api.js model files...');
  
  try {
    // Download files sequentially to avoid overwhelming the network
    for (const file of modelFiles) {
      await downloadFile(file.url, file.dest);
    }
    
    console.log('\nAll models downloaded successfully!');
    console.log('You can now use face-api.js with these models in your project.');
  } catch (error) {
    console.error('\nSome files failed to download.');
    console.error('Please check the errors above and try again.');
  }
};

// Run the download
downloadAll();
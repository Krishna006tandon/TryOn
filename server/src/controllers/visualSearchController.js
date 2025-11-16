import Product from '../models/Product.js';
import { geminiModels, generateEmbedding } from '../config/gemini.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `visual-search-${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// Convert image to base64
const imageToBase64 = (filePath) => {
  const imageBuffer = fs.readFileSync(filePath);
  return imageBuffer.toString('base64');
};

// Extract features from image using Gemini Vision
const extractImageFeatures = async (imagePath) => {
  try {
    const model = geminiModels.vision;
    const imageBase64 = imageToBase64(imagePath);
    
    const prompt = `Analyze this clothing image and extract the following features:
1. Type of clothing (e.g., shirt, dress, pants, shoes)
2. Color(s)
3. Style (e.g., casual, formal, sporty)
4. Pattern (e.g., solid, striped, printed)
5. Category (men, women, kids)
6. Description of the item

Return the information in a structured format.`;

    const result = await model.generateContent([
      {
        inlineData: {
          data: imageBase64,
          mimeType: 'image/jpeg',
        },
      },
      prompt,
    ]);

    const response = await result.response;
    const text = response.text();
    
    // Generate embedding from the description
    const embedding = await generateEmbedding(text);

    return {
      description: text,
      embedding: embedding,
    };
  } catch (error) {
    console.error('Error extracting image features:', error);
    return null;
  }
};

// Calculate cosine similarity
const cosineSimilarity = (vecA, vecB) => {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

// Visual search endpoint
export const visualSearch = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const imagePath = req.file.path;
    const limit = parseInt(req.query.limit) || 10;

    // Extract features from uploaded image
    const imageFeatures = await extractImageFeatures(imagePath);
    
    if (!imageFeatures || !imageFeatures.embedding) {
      // Clean up uploaded file
      fs.unlinkSync(imagePath);
      return res.status(500).json({ error: 'Failed to process image' });
    }

    // Find products with embeddings
    const products = await Product.find({
      embedding: { $exists: true, $ne: null },
      isActive: true,
    });

    // Calculate similarities
    const productsWithSimilarity = products
      .map((product) => ({
        product,
        similarityScore: cosineSimilarity(imageFeatures.embedding, product.embedding),
      }))
      .filter((p) => p.similarityScore > 0.3)
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, limit)
      .map((p) => ({
        ...p.product.toObject(),
        similarityScore: p.similarityScore,
        matchReason: imageFeatures.description,
      }));

    // Clean up uploaded file
    fs.unlinkSync(imagePath);

    res.json({
      queryDescription: imageFeatures.description,
      results: productsWithSimilarity,
      count: productsWithSimilarity.length,
    });
  } catch (error) {
    console.error('Error in visual search:', error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Visual search failed' });
  }
};


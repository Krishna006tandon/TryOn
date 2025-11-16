import Product from '../models/Product.js';
import { geminiModels } from '../config/gemini.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for audio uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `voice-search-${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'), false);
    }
  },
});

// Convert audio to base64
const audioToBase64 = (filePath) => {
  const audioBuffer = fs.readFileSync(filePath);
  return audioBuffer.toString('base64');
};

// Transcribe audio to text using Gemini
const transcribeAudio = async (audioPath, mimeType) => {
  try {
    const model = geminiModels.fast;
    const audioBase64 = audioToBase64(audioPath);
    
    const prompt = `Transcribe this audio to text. Extract any product names, categories, colors, sizes, or search terms mentioned. Return only the transcribed text.`;

    const result = await model.generateContent([
      {
        inlineData: {
          data: audioBase64,
          mimeType: mimeType || 'audio/mpeg',
        },
      },
      prompt,
    ]);

    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error transcribing audio:', error);
    return null;
  }
};

// Search products by text query
const searchProducts = async (query) => {
  try {
    // Text search in MongoDB
    const products = await Product.find({
      $text: { $search: query },
      isActive: true,
    })
      .limit(20)
      .select('name description price images category tags');

    // If no results, try category/name matching
    if (products.length === 0) {
      const categoryMatch = query.match(/\b(men|women|kids|shoes|accessories)\b/i);
      const category = categoryMatch ? categoryMatch[1].toLowerCase() : null;

      const searchQuery = category
        ? { category, isActive: true }
        : {
            $or: [
              { name: { $regex: query, $options: 'i' } },
              { tags: { $in: [new RegExp(query, 'i')] } },
            ],
            isActive: true,
          };

      return await Product.find(searchQuery).limit(20).select('name description price images category tags');
    }

    return products;
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
};

// Voice search endpoint
export const voiceSearch = async (req, res) => {
  try {
    // Option 1: Audio file upload
    if (req.file) {
      const audioPath = req.file.path;
      const mimeType = req.file.mimetype;

      // Transcribe audio
      const transcribedText = await transcribeAudio(audioPath, mimeType);
      
      // Clean up uploaded file
      fs.unlinkSync(audioPath);

      if (!transcribedText) {
        return res.status(500).json({ error: 'Failed to transcribe audio' });
      }

      // Search products
      const products = await searchProducts(transcribedText);

      return res.json({
        transcribedText,
        results: products,
        count: products.length,
      });
    }

    // Option 2: Text query (from client-side speech recognition)
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'No search query provided' });
    }

    const products = await searchProducts(query);

    res.json({
      query,
      results: products,
      count: products.length,
    });
  } catch (error) {
    console.error('Error in voice search:', error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Voice search failed' });
  }
};


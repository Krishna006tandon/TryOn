import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Model configurations for different tasks
export const geminiModels = {
  // Vision tasks (visual search, image analysis)
  vision: genAI.getGenerativeModel({ model: 'gemini-1.5-pro' }),
  
  // Embedding similarity (outfit recommendations) - using embedding model
  embedding: genAI.getGenerativeModel({ model: 'text-embedding-004' }),
  
  // Chatbot (customer support)
  chat: genAI.getGenerativeModel({ model: 'gemini-1.5-pro' }),
  
  // Translations (EN ↔ HI)
  translation: genAI.getGenerativeModel({ model: 'gemini-1.5-pro' }),
  
  // Fast inference (quick responses)
  fast: genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }),
  
  // Heavy reasoning (complex queries)
  reasoning: genAI.getGenerativeModel({ model: 'gemini-1.5-pro' }),
};

// Helper function to generate embeddings using REST API
export const generateEmbedding = async (text) => {
  try {
    // Use REST API for embeddings (text-embedding-004)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'models/text-embedding-004',
          content: {
            parts: [{ text }]
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Embedding API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.embedding?.values || null;
  } catch (error) {
    console.error('Error generating embedding:', error);
    // Return null if embedding generation fails - will fallback to category-based recommendations
    return null;
  }
};

export default genAI;


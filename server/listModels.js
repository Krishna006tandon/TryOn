import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    const { models } = await genAI.listModels();
    console.log("Available Gemini Models:");
    for (const model of models) {
      console.log(`- ${model.name} (Supports: ${model.supportedGenerationMethods.join(', ')})`);
    }
  } catch (error) {
    console.error("Error listing models:", error);
  }
}

listModels();

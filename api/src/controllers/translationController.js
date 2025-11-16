import Product from '../models/Product.js';
import { geminiModels } from '../config/gemini.js';

// Translate text using Gemini
export const translateText = async (req, res) => {
  try {
    const { text, targetLanguage = 'hi' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const sourceLanguage = targetLanguage === 'hi' ? 'en' : 'hi';
    const targetLangName = targetLanguage === 'hi' ? 'Hindi' : 'English';

    const prompt = `Translate the following text from ${sourceLanguage === 'en' ? 'English' : 'Hindi'} to ${targetLangName}. 
Return only the translated text, no explanations.

Text: ${text}`;

    const model = geminiModels.translation;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translatedText = response.text().trim();

    res.json({
      originalText: text,
      translatedText,
      sourceLanguage,
      targetLanguage,
    });
  } catch (error) {
    console.error('Error translating text:', error);
    res.status(500).json({ error: 'Translation failed' });
  }
};

// Translate product descriptions
export const translateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { targetLanguage = 'hi' } = req.query;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if translation already exists
    if (targetLanguage === 'hi' && product.descriptionHi) {
      return res.json({
        product: {
          ...product.toObject(),
          description: product.descriptionHi,
        },
      });
    }

    // Translate description
    const textToTranslate = `${product.name}. ${product.description}`;
    const prompt = `Translate the following product description to ${targetLanguage === 'hi' ? 'Hindi' : 'English'}. 
Return only the translated text, maintaining the same structure.

Text: ${textToTranslate}`;

    const model = geminiModels.translation;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translatedText = response.text().trim();

    // Save translation if Hindi
    if (targetLanguage === 'hi') {
      product.descriptionHi = translatedText;
      await product.save();
    }

    res.json({
      product: {
        ...product.toObject(),
        description: translatedText,
      },
    });
  } catch (error) {
    console.error('Error translating product:', error);
    res.status(500).json({ error: 'Product translation failed' });
  }
};

// Batch translate products
export const batchTranslateProducts = async (req, res) => {
  try {
    const { targetLanguage = 'hi' } = req.body;

    const products = await Product.find({
      descriptionHi: { $exists: false },
      isActive: true,
    }).limit(50);

    let translated = 0;

    for (const product of products) {
      try {
        const textToTranslate = `${product.name}. ${product.description}`;
        const prompt = `Translate to ${targetLanguage === 'hi' ? 'Hindi' : 'English'}: ${textToTranslate}`;

        const model = geminiModels.translation;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const translatedText = response.text().trim();

        product.descriptionHi = translatedText;
        await product.save();
        translated++;

        // Rate limiting
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`Error translating product ${product._id}:`, error);
      }
    }

    res.json({
      message: `Translated ${translated} products`,
      total: products.length,
    });
  } catch (error) {
    console.error('Error in batch translation:', error);
    res.status(500).json({ error: 'Batch translation failed' });
  }
};


import Product from '../models/Product.js';
import Recommendation from '../models/Recommendation.js';
import { generateEmbedding } from '../config/gemini.js';

// Calculate cosine similarity between two embeddings
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

// Get similar products based on embeddings
export const getSimilarProducts = async (req, res) => {
  try {
    const { productId } = req.params;
    const limit = parseInt(req.query.limit) || 5;

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if recommendation exists in cache
    let recommendation = await Recommendation.findOne({
      productId,
      expiresAt: { $gt: new Date() },
    }).populate('recommendedProducts.productId');

    if (recommendation && recommendation.recommendedProducts.length > 0) {
      return res.json({
        product: product,
        recommendations: recommendation.recommendedProducts.slice(0, limit),
      });
    }

    // Generate embedding if not exists
    if (!product.embedding || product.embedding.length === 0) {
      const embeddingText = `${product.name} ${product.description} ${product.category} ${product.tags?.join(' ')}`;
      product.embedding = await generateEmbedding(embeddingText);
      if (product.embedding && product.embedding.length > 0) {
        await product.save();
      }
    }

    if (!product.embedding) {
      // Fallback to category-based recommendation
      const similarProducts = await Product.find({
        _id: { $ne: productId },
        category: product.category,
        isActive: true,
      })
        .limit(limit)
        .select('name price images category description');

      return res.json({
        product: product,
        recommendations: similarProducts.map((p) => ({
          productId: p,
          similarityScore: 0.5,
          reason: 'Similar category',
        })),
      });
    }

    // Find all products with embeddings
    const allProducts = await Product.find({
      _id: { $ne: productId },
      embedding: { $exists: true, $ne: null },
      isActive: true,
    });

    // Calculate similarities
    const productsWithSimilarity = allProducts
      .map((p) => ({
        productId: p,
        similarityScore: cosineSimilarity(product.embedding, p.embedding),
      }))
      .filter((p) => p.similarityScore > 0.3)
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, limit);

    // Cache the recommendation
    await Recommendation.findOneAndUpdate(
      { productId },
      {
        productId,
        recommendedProducts: productsWithSimilarity,
        type: 'similarity',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      { upsert: true, new: true }
    );

    res.json({
      product: product,
      recommendations: productsWithSimilarity,
    });
  } catch (error) {
    console.error('Error getting similar products:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
};

// Generate embeddings for all products (admin utility)
export const generateAllEmbeddings = async (req, res) => {
  try {
    const products = await Product.find({ embedding: { $exists: false } });
    let processed = 0;

    for (const product of products) {
      const embeddingText = `${product.name} ${product.description} ${product.category} ${product.tags?.join(' ')}`;
      product.embedding = await generateEmbedding(embeddingText);
      if (product.embedding && product.embedding.length > 0) {
        await product.save();
        processed++;
      }
      // Rate limiting - wait a bit between requests
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    res.json({ message: `Generated embeddings for ${processed} products` });
  } catch (error) {
    console.error('Error generating embeddings:', error);
    res.status(500).json({ error: 'Failed to generate embeddings' });
  }
};


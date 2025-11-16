import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000';

const PersonalizedOffers = ({ userId, onProductClick }) => {
  const [offers, setOffers] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOffers = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/personalized-offers/${userId}`);
      setOffers(response.data);
    } catch (error) {
      console.error('Error fetching personalized offers:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchOffers();
    }
  }, [userId, fetchOffers]);

  if (loading) {
    return (
      <div className="my-12">
        <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
      </div>
    );
  }

  if (!offers || offers.recommendedProducts?.length === 0) {
    return null;
  }

  return (
    <div className="my-12 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h2 className="text-3xl font-light mb-2">Special Offer for You!</h2>
        <div className="text-4xl font-bold text-purple-600 mb-4">
          {offers.discountPercentage}% OFF
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">{offers.offerMessage}</p>
      </motion.div>

      {offers.recommendedProducts && offers.recommendedProducts.length > 0 && (
        <div>
          <h3 className="text-xl font-medium mb-4">Recommended for You</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {offers.recommendedProducts.map((product, idx) => {
              const image = product.images?.[0]?.url || product.primary;
              const finalPrice = product.originalPrice
                ? product.originalPrice * (1 - offers.discountPercentage / 100)
                : product.price;

              return (
                <motion.div
                  key={product._id || product.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="cursor-pointer group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  onClick={() => onProductClick && onProductClick(product)}
                >
                  <div className="relative overflow-hidden aspect-square">
                    <img
                      src={image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {offers.discountPercentage > 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        -{offers.discountPercentage}%
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                      <span className="text-sm font-bold">${finalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalizedOffers;


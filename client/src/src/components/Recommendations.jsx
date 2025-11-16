import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000';

const Recommendations = ({ productId, onProductClick }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/recommendations/${productId}`);
        setRecommendations(response.data.recommendations || []);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchRecommendations();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="mt-12">
        <h3 className="text-2xl font-light mb-6">You may also like</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-64 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-light mb-6">You may also like</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recommendations.map((rec, idx) => {
          const product = rec.productId || rec;
          const image = product.images?.[0]?.url || product.primary || product.image;
          
          return (
            <motion.div
              key={product._id || product.id || idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="cursor-pointer group"
              onClick={() => onProductClick && onProductClick(product)}
            >
              <div className="relative overflow-hidden rounded-lg aspect-square mb-2">
                <img
                  src={image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="text-sm font-medium">{product.name}</p>
              <p className="text-sm text-gray-600">${product.price || product.price?.replace(/[^0-9.]/g, '')}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Recommendations;

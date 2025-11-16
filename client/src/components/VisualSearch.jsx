import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://tryon-d5zv.onrender.com';

const VisualSearch = ({ onResults }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/visual-search`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setResults(response.data.results || []);
      if (onResults) {
        onResults(response.data.results);
      }
    } catch (err) {
      setError('Failed to process image. Please try again.');
      console.error('Visual search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Visual Search"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-light">Visual Search</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="visual-search-input"
                  disabled={loading}
                />
                <label
                  htmlFor="visual-search-input"
                  className="cursor-pointer flex flex-col items-center"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4" />
                  ) : (
                    <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                  <p className="text-gray-600">
                    {loading ? 'Analyzing image...' : 'Upload an image to find similar products'}
                  </p>
                </label>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
              )}

              {results.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Similar Products</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {results.map((product, idx) => (
                      <motion.div
                        key={product._id || idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="cursor-pointer group"
                        onClick={() => {
                          if (onResults) onResults([product]);
                          setIsOpen(false);
                        }}
                      >
                        <div className="relative overflow-hidden rounded-lg aspect-square mb-2">
                          <img
                            src={product.images?.[0]?.url || product.primary}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-sm text-gray-600">${product.price}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VisualSearch;

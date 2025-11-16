import { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { getProductsBySearchTerm, getProductsByCategory } from '../data/productData';
import './SearchResults.css';

const SearchResults = ({ onAddToCart = () => {}, onProductClick = () => {} }) => {
  const { query, category } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState(new Set());
  const [sortBy, setSortBy] = useState('relevance');

  const fetchWishlist = useCallback(async () => {
    if (!user) return;
    try {
      const response = await api.get(`/user-details/${user.id}`);
      if (response.data?.wishlist) {
        const wishlistIds = new Set(response.data.wishlist.map(item => item.productId));
        setWishlist(wishlistIds);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  }, [user]);

  // Load wishlist from database
  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user, fetchWishlist]);

  const products = useMemo(() => {
    if (category) {
      return getProductsByCategory(category);
    }
    if (query) {
      return getProductsBySearchTerm(query);
    }
    return [];
  }, [query, category]);

  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => parseFloat(a.price.replace(/[^0-9.]/g, '')) - parseFloat(b.price.replace(/[^0-9.]/g, '')));
      case 'price-high':
        return sorted.sort((a, b) => parseFloat(b.price.replace(/[^0-9.]/g, '')) - parseFloat(a.price.replace(/[^0-9.]/g, '')));
      case 'newest':
        return sorted.reverse();
      default:
        return sorted;
    }
  }, [products, sortBy]);

  const toggleWishlist = async (productId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) return;

    const isInWishlist = wishlist.has(productId);

    try {
      if (isInWishlist) {
        // Remove from wishlist
        await api.delete(`/user-details/${user.id}/wishlist`, {
          data: { productId },
        });
        setWishlist((prev) => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
      } else {
        // Add to wishlist
        await api.post(`/user-details/${user.id}/wishlist`, {
          productId,
          productImage: product.image,
          productName: product.name,
          price: product.price,
        });
        setWishlist((prev) => {
          const newSet = new Set(prev);
          newSet.add(productId);
          return newSet;
        });
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      alert('Failed to update wishlist. Please try again.');
    }
  };

  const displayQuery = category ? category.charAt(0).toUpperCase() + category.slice(1) : query;

  return (
    <main className="search-results-page">
      <div className="search-results-container">
        <div className="breadcrumbs">
          <span>Home</span>
          <span>›</span>
          <span>{category ? 'Category' : 'Search'}</span>
          <span>›</span>
          <span>{displayQuery}</span>
        </div>

        <div className="results-header">
          <h1>
            Showing {sortedProducts.length} results for "{displayQuery}"
          </h1>
          <div className="sort-options">
            <span>Sort By:</span>
            <button
              className={sortBy === 'relevance' ? 'active' : ''}
              onClick={() => setSortBy('relevance')}
            >
              Relevance
            </button>
            <button
              className={sortBy === 'price-low' ? 'active' : ''}
              onClick={() => setSortBy('price-low')}
            >
              Price -- Low to High
            </button>
            <button
              className={sortBy === 'price-high' ? 'active' : ''}
              onClick={() => setSortBy('price-high')}
            >
              Price -- High to Low
            </button>
            <button
              className={sortBy === 'newest' ? 'active' : ''}
              onClick={() => setSortBy('newest')}
            >
              Newest First
            </button>
          </div>
        </div>

        <div className="products-grid">
          {sortedProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              className="product-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="product-image-wrapper">
                <img src={product.image} alt={product.name} />
                <button
                  className={`wishlist-btn ${wishlist.has(product.id) ? 'active' : ''}`}
                  onClick={() => toggleWishlist(product.id)}
                  aria-label="Add to wishlist"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
                <button
                  className="cart-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product);
                  }}
                  aria-label="Add to cart"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                </button>
                {product.discount && (
                  <span className="discount-badge">{product.discount}% off</span>
                )}
              </div>
              <div className="product-info">
                
                <p className="product-name">{product.name}</p>
                <div className="product-pricing">
                  <span className="current-price">{product.price}</span>
                  {product.originalPrice && (
                    <>
                      <span className="original-price">{product.originalPrice}</span>
                      {product.discount && (
                        <span className="discount-text">{product.discount}% off</span>
                      )}
                    </>
                  )}
                </div>
                {product.assured && (
                  <div className="assured-badge">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                    </svg>
                    <span>Assured</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <div className="no-results">
            <p>No products found for "{displayQuery}"</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default SearchResults;


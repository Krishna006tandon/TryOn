import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import './ProductDetails.css';

const ProductDetails = ({ products = [], onAddToCart = () => {}, onExploreMore = () => {} }) => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const product = useMemo(
    () => products.find((item) => String(item.id) === String(productId)),
    [products, productId],
  );

  const gallery = useMemo(() => {
    if (!product) return [];
    const base = [product.primary || product.image, product.alternate, ...(product.gallery || [])];
    return base.filter(Boolean);
  }, [product]);

  if (!product) {
    return (
      <main className="product-shell">
        <div className="product-empty">
          <p>Product not found.</p>
          <button onClick={() => navigate('/')}>Back to home</button>
        </div>
      </main>
    );
  }

  return (
    <main className="product-shell">
      <button className="product-back" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <section className="product-grid">
        <div className="product-gallery">
          {gallery.map((image, idx) => (
            <motion.img
              key={image || idx}
              src={image}
              alt={`${product.name} ${idx + 1}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            />
          ))}
        </div>
        <div className="product-info">
          <p className="product-tagline">{product.tag || 'Featured drop'}</p>
          <h1>{product.name || product.title}</h1>
          <p className="product-price">{product.price}</p>
          <p className="product-description">
            {product.description ||
              'Engineered layers with technical stretch, breathable linings, and hidden utility pockets for daily rotations.'}
          </p>
          <ul className="product-specs">
            <li>Material: Italian brushed cotton & bio-nylon</li>
            <li>Fit: Relaxed tailored silhouette</li>
            <li>Care: Dry clean preferred</li>
            <li>Origin: Made in Portugal</li>
          </ul>
          <div className="product-actions">
            <button
              onClick={() => {
                onAddToCart(product);
              }}
            >
              Add to Cart
            </button>
            <button className="ghost" onClick={onExploreMore}>
              Explore more looks
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductDetails;


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutGroup, motion } from 'framer-motion';
import './TrendingOutfits.css';

// Import category images
import hoodie1 from '../images/hoodie1.png';
import hoodie2 from '../images/hoodie2.png';
import hoodie3 from '../images/hoodie3.png';
import hoodie4 from '../images/hoodie4.png';
import hoodie5 from '../images/hoodie5.png';
import jeans1 from '../images/Jeans1.png';
import jeans2 from '../images/Jeans2.png';
import tuxedo1 from '../images/tuxedo1.png';
import tuxedo2 from '../images/tuxedo2.png';
import tuxedo3 from '../images/tuxedo3.png';
import tuxedo4 from '../images/tuxedo4.png';
import tuxedo5 from '../images/tuxedo5.png';
import kurta1 from '../images/Kurta1.png';
import kurta2 from '../images/Kurta2.png';
import kurta3 from '../images/Kurta3.png';
import kurta4 from '../images/Kurta4.png';
import kurta5 from '../images/Kurta5.png';
import dress1 from '../images/Dress1.png';
import dress2 from '../images/Dress2.png';
import dress3 from '../images/Dress3.png';
import dress4 from '../images/Dress4.png';
import dress5 from '../images/Dress5.png';
import shirt1 from '../images/Shirt1.png';
import shirt2 from '../images/Shirt2.png';
import shirt3 from '../images/Shirt3.png';
import shirt4 from '../images/Shirt4.png';
import shirt5 from '../images/Shirt5.png';
import lehenga1 from '../images/lehenga1.png';
import lehenga2 from '../images/lehenga2.png';
import lehenga3 from '../images/lehenga3.png';
import lehenga4 from '../images/lehenga4.png';
import lehenga5 from '../images/lehenga5.png';

const categories = [
  {
    name: 'Casual',
    searchTerm: 'Hoodie',
    tag: 'Casual',
    items: [
      { id: 'casual-1', image: hoodie1, title: 'Casual Look 1', categoryTag: 'Casual' },
      { id: 'casual-2', image: hoodie2, title: 'Casual Look 2', categoryTag: 'Casual' },
      { id: 'casual-3', image: hoodie3, title: 'Casual Look 3', categoryTag: 'Casual' },
      { id: 'casual-4', image: hoodie4, title: 'Casual Look 4', categoryTag: 'Casual' },
      { id: 'casual-5', image: hoodie5, title: 'Casual Look 5', categoryTag: 'Casual' },
      { id: 'casual-6', image: jeans1, title: 'Casual Look 6', categoryTag: 'Casual' },
      { id: 'casual-7', image: jeans2, title: 'Casual Look 7', categoryTag: 'Casual' },
    ],
  },
  {
    name: 'Formal',
    searchTerm: 'Tuxedo',
    tag: 'Formal',
    items: [
      { id: 'formal-1', image: tuxedo1, title: 'Formal Look 1', categoryTag: 'Formal' },
      { id: 'formal-2', image: tuxedo2, title: 'Formal Look 2', categoryTag: 'Formal' },
      { id: 'formal-3', image: tuxedo3, title: 'Formal Look 3', categoryTag: 'Formal' },
      { id: 'formal-4', image: tuxedo4, title: 'Formal Look 4', categoryTag: 'Formal' },
      { id: 'formal-5', image: tuxedo5, title: 'Formal Look 5', categoryTag: 'Formal' },
    ],
  },
  {
    name: 'Traditional',
    searchTerm: 'Kurta',
    tag: 'Traditional',
    items: [
      { id: 'traditional-1', image: kurta1, title: 'Traditional Look 1', categoryTag: 'Traditional' },
      { id: 'traditional-2', image: kurta2, title: 'Traditional Look 2', categoryTag: 'Traditional' },
      { id: 'traditional-3', image: kurta3, title: 'Traditional Look 3', categoryTag: 'Traditional' },
      { id: 'traditional-4', image: kurta4, title: 'Traditional Look 4', categoryTag: 'Traditional' },
      { id: 'traditional-5', image: kurta5, title: 'Traditional Look 5', categoryTag: 'Traditional' },
    ],
  },
  {
    name: 'Party',
    searchTerm: 'Dress',
    tag: 'Party',
    items: [
      { id: 'party-1', image: dress1, title: 'Party Look 1', categoryTag: 'Party' },
      { id: 'party-2', image: dress2, title: 'Party Look 2', categoryTag: 'Party' },
      { id: 'party-3', image: dress3, title: 'Party Look 3', categoryTag: 'Party' },
      { id: 'party-4', image: dress4, title: 'Party Look 4', categoryTag: 'Party' },
      { id: 'party-5', image: dress5, title: 'Party Look 5', categoryTag: 'Party' },
    ],
  },
  {
    name: 'Work',
    searchTerm: 'Shirt',
    tag: 'Work',
    items: [
      { id: 'work-1', image: shirt1, title: 'Work Look 1', categoryTag: 'Work' },
      { id: 'work-2', image: shirt2, title: 'Work Look 2', categoryTag: 'Work' },
      { id: 'work-3', image: shirt3, title: 'Work Look 3', categoryTag: 'Work' },
      { id: 'work-4', image: shirt4, title: 'Work Look 4', categoryTag: 'Work' },
      { id: 'work-5', image: shirt5, title: 'Work Look 5', categoryTag: 'Work' },
    ],
  },
  {
    name: 'Festive',
    searchTerm: 'Lehenga',
    tag: 'Festive',
    items: [
      { id: 'festive-1', image: lehenga1, title: 'Festive Look 1', categoryTag: 'Festive' },
      { id: 'festive-2', image: lehenga2, title: 'Festive Look 2', categoryTag: 'Festive' },
      { id: 'festive-3', image: lehenga3, title: 'Festive Look 3', categoryTag: 'Festive' },
      { id: 'festive-4', image: lehenga4, title: 'Festive Look 4', categoryTag: 'Festive' },
      { id: 'festive-5', image: lehenga5, title: 'Festive Look 5', categoryTag: 'Festive' },
    ],
  },
];

const CategorySection = ({ onCategoryClick = () => {} }) => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');

  const handleCategoryClick = (searchTerm) => {
    navigate(`/search/${encodeURIComponent(searchTerm)}`);
  };

  const handleSeeMore = () => {
    if (activeCategory === 'All') {
      // Navigate to a general search or show all products
      navigate('/search/all');
    } else {
      const activeCategoryData = categories.find((cat) => cat.name === activeCategory);
      if (activeCategoryData) {
        handleCategoryClick(activeCategoryData.searchTerm);
      }
    }
  };

  const activeCategoryData = categories.find((cat) => cat.name === activeCategory);
  const allItems = categories.flatMap((cat) => cat.items);
  const displayItems = activeCategory === 'All' ? allItems : (activeCategoryData?.items || []);

  return (
    <section className="trending-shell" id="trending">
      <div className="section-head">
        <h2>Trending</h2>
        <p>Find the perfect style for every occasion.</p>
      </div>
      <LayoutGroup>
        <div className="filter-pills">
          <motion.button
            className={`pill filter ${activeCategory === 'All' ? 'active' : ''}`}
            onClick={() => setActiveCategory('All')}
            whileHover={{ y: -2 }}
          >
            All
            {activeCategory === 'All' && (
              <motion.span layoutId="pill" className="pill-highlight" />
            )}
          </motion.button>
          {categories.map((category) => (
            <motion.button
              key={category.name}
              className={`pill filter ${category.name === activeCategory ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.name)}
              whileHover={{ y: -2 }}
            >
              {category.name}
              {category.name === activeCategory && (
                <motion.span layoutId="pill" className="pill-highlight" />
              )}
            </motion.button>
          ))}
        </div>
      </LayoutGroup>
      <div className="trending-grid">
        {displayItems.map((item, idx) => (
          <motion.article
            key={item.id}
            className="trend-card"
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05, duration: 0.6 }}
            onClick={() => {
              if (activeCategory === 'All') {
                // Find which category this item belongs to
                const itemCategory = categories.find(cat => 
                  cat.items.some(catItem => catItem.id === item.id)
                );
                if (itemCategory) {
                  handleCategoryClick(itemCategory.searchTerm);
                }
              } else if (activeCategoryData) {
                handleCategoryClick(activeCategoryData.searchTerm);
              }
            }}
          >
            <img src={item.image} alt={item.title} />
            <div className="trend-info">
              <p>{item.title}</p>
              <span>{activeCategory === 'All' ? item.categoryTag || 'Trending' : activeCategoryData?.tag}</span>
            </div>
          </motion.article>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <motion.button
          className="see-more-btn"
          onClick={handleSeeMore}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: '0.75rem 2rem',
            borderRadius: '999px',
            border: '1px solid var(--stroke)',
            background: 'rgba(255, 255, 255, 0.05)',
            color: 'var(--muted)',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 500,
            transition: 'all 0.3s ease',
          }}
        >
          See More
        </motion.button>
      </div>
    </section>
  );
};

export default CategorySection;


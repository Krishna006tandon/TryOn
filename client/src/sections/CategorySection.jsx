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
      { id: 'casual-1', image: hoodie1, title: 'Casual Look 1' },
      { id: 'casual-2', image: hoodie2, title: 'Casual Look 2' },
      { id: 'casual-3', image: hoodie3, title: 'Casual Look 3' },
      { id: 'casual-4', image: hoodie4, title: 'Casual Look 4' },
      { id: 'casual-5', image: hoodie5, title: 'Casual Look 5' },
      { id: 'casual-6', image: jeans1, title: 'Casual Look 6' },
      { id: 'casual-7', image: jeans2, title: 'Casual Look 7' },
    ],
  },
  {
    name: 'Formal',
    searchTerm: 'Tuxedo',
    tag: 'Formal',
    items: [
      { id: 'formal-1', image: tuxedo1, title: 'Formal Look 1' },
      { id: 'formal-2', image: tuxedo2, title: 'Formal Look 2' },
      { id: 'formal-3', image: tuxedo3, title: 'Formal Look 3' },
      { id: 'formal-4', image: tuxedo4, title: 'Formal Look 4' },
      { id: 'formal-5', image: tuxedo5, title: 'Formal Look 5' },
    ],
  },
  {
    name: 'Traditional',
    searchTerm: 'Kurta',
    tag: 'Traditional',
    items: [
      { id: 'traditional-1', image: kurta1, title: 'Traditional Look 1' },
      { id: 'traditional-2', image: kurta2, title: 'Traditional Look 2' },
      { id: 'traditional-3', image: kurta3, title: 'Traditional Look 3' },
      { id: 'traditional-4', image: kurta4, title: 'Traditional Look 4' },
      { id: 'traditional-5', image: kurta5, title: 'Traditional Look 5' },
    ],
  },
  {
    name: 'Party',
    searchTerm: 'Dress',
    tag: 'Party',
    items: [
      { id: 'party-1', image: dress1, title: 'Party Look 1' },
      { id: 'party-2', image: dress2, title: 'Party Look 2' },
      { id: 'party-3', image: dress3, title: 'Party Look 3' },
      { id: 'party-4', image: dress4, title: 'Party Look 4' },
      { id: 'party-5', image: dress5, title: 'Party Look 5' },
    ],
  },
  {
    name: 'Work',
    searchTerm: 'Shirt',
    tag: 'Work',
    items: [
      { id: 'work-1', image: shirt1, title: 'Work Look 1' },
      { id: 'work-2', image: shirt2, title: 'Work Look 2' },
      { id: 'work-3', image: shirt3, title: 'Work Look 3' },
      { id: 'work-4', image: shirt4, title: 'Work Look 4' },
      { id: 'work-5', image: shirt5, title: 'Work Look 5' },
    ],
  },
  {
    name: 'Festive',
    searchTerm: 'Lehenga',
    tag: 'Festive',
    items: [
      { id: 'festive-1', image: lehenga1, title: 'Festive Look 1' },
      { id: 'festive-2', image: lehenga2, title: 'Festive Look 2' },
      { id: 'festive-3', image: lehenga3, title: 'Festive Look 3' },
      { id: 'festive-4', image: lehenga4, title: 'Festive Look 4' },
      { id: 'festive-5', image: lehenga5, title: 'Festive Look 5' },
    ],
  },
];

const CategorySection = ({ onCategoryClick = () => {} }) => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Casual');

  const handleCategoryClick = (searchTerm) => {
    navigate(`/search/${encodeURIComponent(searchTerm)}`);
  };

  const activeCategoryData = categories.find((cat) => cat.name === activeCategory) || categories[0];
  const allItems = categories.flatMap((cat) => cat.items);

  return (
    <section className="trending-shell" id="trending">
      <div className="section-head">
        <h2>Shop by Category</h2>
        <p>Find the perfect style for every occasion.</p>
      </div>
      <LayoutGroup>
        <div className="filter-pills">
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
        {activeCategoryData.items.map((item, idx) => (
          <motion.article
            key={item.id}
            className="trend-card"
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05, duration: 0.6 }}
            onClick={() => handleCategoryClick(activeCategoryData.searchTerm)}
          >
            <img src={item.image} alt={item.title} />
            <div className="trend-info">
              <p>{item.title}</p>
              <span>{activeCategoryData.tag}</span>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;


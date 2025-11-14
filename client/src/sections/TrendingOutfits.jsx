import { useMemo, useState } from 'react';
import { LayoutGroup, motion } from 'framer-motion';
import './TrendingOutfits.css';

const TrendingOutfits = ({ items = [] }) => {
  const tags = useMemo(() => ['All', ...new Set(items.map((item) => item.tag))], [items]);
  const [activeTag, setActiveTag] = useState('All');

  const filtered = useMemo(
    () => (activeTag === 'All' ? items : items.filter((item) => item.tag === activeTag)),
    [activeTag, items],
  );

  return (
    <section className="trending-shell">
      <div className="section-head">
        <h2>Trending Outfits</h2>
        <p>Curated looks updated hourly.</p>
      </div>
      <LayoutGroup>
        <div className="filter-pills">
          {tags.map((tag) => (
            <motion.button
              key={tag}
              className={`pill filter ${tag === activeTag ? 'active' : ''}`}
              onClick={() => setActiveTag(tag)}
              whileHover={{ y: -2 }}
            >
              {tag}
              {tag === activeTag && (
                <motion.span layoutId="pill" className="pill-highlight" />
              )}
            </motion.button>
          ))}
        </div>
      </LayoutGroup>
      <div className="trending-grid">
        {filtered.map((item, idx) => (
          <motion.article
            key={item.id}
            className="trend-card"
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05, duration: 0.6 }}
          >
            <img src={item.image} alt={item.title} />
            <div className="trend-info">
              <p>{item.title}</p>
              <span>{item.tag}</span>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default TrendingOutfits;


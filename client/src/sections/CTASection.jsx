import { motion } from 'framer-motion';
import './CTASection.css';

const CTASection = () => (
  <section className="cta-shell">
    <motion.div
      className="cta-card"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <p className="eyebrow">capsule drop</p>
      <h3>Sculpted Minimalist Capsule</h3>
      <p>29 limited looks in a monochrome pastel palette.</p>
      <div className="cta-actions">
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}>
          Shop Now
        </motion.button>
        <motion.button
          className="ghost"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
        >
          Explore Collection
        </motion.button>
      </div>
    </motion.div>
  </section>
);

export default CTASection;


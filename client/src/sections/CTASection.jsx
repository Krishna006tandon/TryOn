import { motion } from 'framer-motion';
import './CTASection.css';

const CTASection = ({ onPrimaryAction = () => {}, onSecondaryAction = () => {} }) => (
  <section className="cta-shell" id="capsule">
    <motion.div
      className="cta-card"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <p className="eyebrow">Discover Your Style. Wear Your Confidence.</p>
      <h3>Timeless Essentials for the Modern You.</h3>
      <p>Be Bold. Be Stylish. Be You.</p>
      <p>Fresh Styles Just Dropped — Grab Yours Before They're Gone!</p>
      <p>Join Thousands Who Upgraded Their Wardrobe Today</p>
      <div className="cta-actions">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPrimaryAction}
        >
          Shop Bestsellers
        </motion.button>
      </div>
    </motion.div>
  </section>
);

export default CTASection;


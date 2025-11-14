import { motion } from 'framer-motion';
import './UtilityStrip.css';

const badges = [
  { title: '48H Delivery', subtitle: 'On curated capsules' },
  { title: 'Express Returns', subtitle: 'Extended 30-day window' },
  { title: 'Concierge', subtitle: 'Styling 24/7 support' },
];

const UtilityStrip = () => (
  <section className="utility-strip">
    {badges.map((badge) => (
      <motion.div
        key={badge.title}
        className="utility-card"
        whileHover={{ y: -4, boxShadow: '0 15px 35px rgba(0,0,0,0.12)' }}
      >
        <p className="utility-title">{badge.title}</p>
        <p className="utility-subtitle">{badge.subtitle}</p>
      </motion.div>
    ))}
  </section>
);

export default UtilityStrip;






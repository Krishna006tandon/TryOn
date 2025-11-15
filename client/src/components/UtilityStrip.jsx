import { motion } from 'framer-motion';
import './UtilityStrip.css';

const badges = [
  { title: 'Wedding Guest', subtitle: '' },
  { title: 'Party Wear', subtitle: '' },
  { title: 'Wear to Work!', subtitle: '' },
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







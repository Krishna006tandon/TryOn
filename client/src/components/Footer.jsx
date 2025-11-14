import { motion } from 'framer-motion';
import './Footer.css';

const social = ['Instagram', 'Pinterest', 'TikTok', 'YouTube'];

const Footer = () => (
  <footer className="footer-shell">
    <div className="footer-left">
      <h3>Stay in the know</h3>
      <p>Weekly drops, styling notes, and private previews.</p>
      <div className="newsletter">
        <input placeholder="Email address" type="email" />
        <motion.button whileTap={{ scale: 0.96 }}>Join</motion.button>
      </div>
    </div>
    <div className="footer-center">
      <p className="footer-label">Social</p>
      <div className="social-list">
        {social.map((item) => (
          <motion.a key={item} whileHover={{ x: 6 }} href="#">
            {item}
          </motion.a>
        ))}
      </div>
    </div>
    <div className="footer-right">
      <p className="footer-label">Contact</p>
      <p>concierge@tryoncollective.com</p>
      <p>+1 (212) 555 0118</p>
      <p>123 Mercer St, NYC</p>
    </div>
  </footer>
);

export default Footer;


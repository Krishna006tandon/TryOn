import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './UtilityStrip.css';
import weddingGuestImg from '../images/Wedding_Guest.png';
import partyWearImg from '../images/Party_Wear.png';
import wearToWorkImg from '../images/Wear_To_Work.png';

const badges = [
  { 
    title: 'Wedding Guest', 
    subtitle: '',
    backgroundImage: weddingGuestImg,
    searchQuery: 'shervani, lehenga'
  },
  { 
    title: 'Party Wear', 
    subtitle: '',
    backgroundImage: partyWearImg,
    searchQuery: 'party wear'
  },
  { 
    title: 'Wear to Work!', 
    subtitle: '',
    backgroundImage: wearToWorkImg,
    searchQuery: 'shirt'
  },
];

const UtilityStrip = () => {
  const navigate = useNavigate();

  const handleCardClick = (searchQuery) => {
    navigate(`/search/${encodeURIComponent(searchQuery)}`);
  };

  return (
    <section className="utility-strip">
      {badges.map((badge) => (
        <motion.div
          key={badge.title}
          className="utility-card"
          style={{
            backgroundImage: `url(${badge.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            cursor: 'pointer',
          }}
          whileHover={{ y: -4, boxShadow: '0 15px 35px rgba(0,0,0,0.12)', scale: 1.02 }}
          onClick={() => handleCardClick(badge.searchQuery)}
        >
          <div className="utility-overlay">
            <p className="utility-title">{badge.title}</p>
            <p className="utility-subtitle">{badge.subtitle}</p>
          </div>
        </motion.div>
      ))}
    </section>
  );
};

export default UtilityStrip;







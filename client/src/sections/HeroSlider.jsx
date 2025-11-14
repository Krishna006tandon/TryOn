import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './HeroSlider.css';

const sliderInterval = 6000;

const HeroSlider = ({ slides = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!slides.length) return undefined;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, sliderInterval);
    return () => clearInterval(timer);
  }, [slides]);

  const activeSlide = slides[activeIndex] || {};

  return (
    <section className="hero-shell">
      <div className="hero-overlay" />
      <AnimatePresence mode="wait">
        <motion.img
          key={activeSlide.id}
          src={activeSlide.image}
          alt={activeSlide.title}
          className="hero-image"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />
      </AnimatePresence>
      <div className="hero-content">
        <motion.p
          className="eyebrow"
          key={`${activeSlide.id}-eyebrow`}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          featured edit
        </motion.p>
        <AnimatePresence mode="wait">
          <motion.h1
            key={activeSlide.id}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {activeSlide.title}
          </motion.h1>
        </AnimatePresence>
        <p>{activeSlide.subtitle}</p>
        <div className="hero-cta">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
            {activeSlide.cta || 'Shop Now'}
          </motion.button>
          <motion.button
            className="secondary"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
          >
            Explore Collection
          </motion.button>
        </div>
        <div className="hero-dots">
          {slides.map((slide, idx) => (
            <motion.button
              key={slide.id}
              className={`dot ${idx === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(idx)}
              aria-label={`Go to ${slide.title}`}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;


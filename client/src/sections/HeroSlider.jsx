import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './HeroSlider.css';

const sliderInterval = 6000;

const HeroSlider = ({
  slides = [],
  onPrimaryAction = () => {},
  onSecondaryAction = () => {},
  isHydrated = false,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!slides.length) return undefined;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, sliderInterval);
    return () => clearInterval(timer);
  }, [slides]);

  const hasSlides = slides.length > 0;
  const activeSlide =
    slides[activeIndex] || {
      id: 'placeholder',
      title: 'Collection incoming',
      subtitle: 'Connect to the API to view the latest looks.',
      cta: 'Discover Looks',
    };

  return (
    <section className={`hero-shell ${!hasSlides && !isHydrated ? 'loading' : ''}`} id="hero">
      {hasSlides && (
        <AnimatePresence mode="wait">
          <motion.img
            key={activeSlide.id}
            src={activeSlide.image}
            alt="Hero slide"
            className="hero-image"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />
        </AnimatePresence>
      )}
      {hasSlides && (
        <div className="hero-dots">
          {slides.map((slide, idx) => (
            <motion.button
              key={slide.id}
              className={`dot ${idx === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroSlider;


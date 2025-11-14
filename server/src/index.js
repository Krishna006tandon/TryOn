import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());

const heroSlides = [
  {
    id: 1,
    title: 'New Nordic Layers',
    subtitle: 'Elevate everyday staples.',
    cta: 'Shop Now',
    image: 'photo-1475180098004-ca77a66827be',
  },
  {
    id: 2,
    title: 'Soft Pastel Resort',
    subtitle: 'Airy silhouettes arrive today.',
    cta: 'Explore Collection',
    image: 'photo-1487412720507-e7ab37603c6f',
  },
];

const featured = heroSlides.map((slide, idx) => ({
  id: `feat-${idx}`,
  name: slide.title,
  price: `$${200 + idx * 40}`,
  primary: slide.image,
  alternate: slide.image,
  tag: 'New',
}));

const withImage = (path) =>
  `https://images.unsplash.com/${path}?auto=format&fit=crop&w=1600&q=80`;

app.get('/api/hero', (_req, res) => {
  res.json(heroSlides.map((slide) => ({ ...slide, image: withImage(slide.image) })));
});

app.get('/api/featured', (_req, res) => {
  res.json(featured.map((item) => ({ ...item, primary: withImage(item.primary), alternate: withImage(item.alternate) })));
});

app.get('/api/trending', (_req, res) => {
  res.json(
    featured.map((item, idx) => ({
      id: `trend-${idx}`,
      title: item.name,
      tag: idx % 2 === 0 ? 'Street' : 'Resort',
      image: withImage(item.primary),
    })),
  );
});

app.listen(port, () => {
  console.log(`Server ready on http://localhost:${port}`);
});


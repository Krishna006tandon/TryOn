import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file from server root directory
dotenv.config({ path: path.join(__dirname, '../.env') });

// Routes
import recommendationRoutes from './routes/recommendationRoutes.js';
import visualSearchRoutes from './routes/visualSearchRoutes.js';
import voiceSearchRoutes from './routes/voiceSearchRoutes.js';
import chatbotRoutes from './routes/chatbotRoutes.js';
import personalizedOffersRoutes from './routes/personalizedOffersRoutes.js';
import deliveryTrackingRoutes from './routes/deliveryTrackingRoutes.js';
import translationRoutes from './routes/translationRoutes.js';
import rewardPointsRoutes from './routes/rewardPointsRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js'; // Import userRoutes

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (invoices, uploads)
app.use('/invoices', express.static(path.join(__dirname, '../invoices')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Connect to MongoDB
connectDB();

// Legacy API routes (for backward compatibility)
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

// API Routes
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/visual-search', visualSearchRoutes);
app.use('/api/voice-search', voiceSearchRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/personalized-offers', personalizedOffersRoutes);
app.use('/api/delivery-tracking', deliveryTrackingRoutes);
app.use('/api/translate', translationRoutes);
app.use('/api/reward-points', rewardPointsRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`Server ready on http://localhost:${port}`);
});




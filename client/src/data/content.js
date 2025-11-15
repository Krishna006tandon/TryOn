import hero1 from '../images/1.png';
import hero2 from '../images/2.png';
import hero3 from '../images/3.png';
import hero4 from '../images/4.png';
import hero5 from '../images/5.png';
import menCategory from '../images/men_category.png';
import womenCategory from '../images/women_category.png';
import kidsCategory from '../images/kids_category.png';

const placeholder = (path) =>
  `https://images.unsplash.com/${path}?auto=format&fit=crop&w=1600&q=80`;

export const fetchHeroSlides = () => [
  {
    id: 1,
    title: 'Discover Your Style. Wear Your Confidence.',
    subtitle: '',
    cta: 'Shop Bestsellers',
    image: hero1,
  },
  {
    id: 2,
    title: 'Timeless Essentials for the Modern You.',
    subtitle: '',
    cta: 'Shop Bestsellers',
    image: hero2,
  },
  {
    id: 3,
    title: 'Be Bold. Be Stylish. Be You.',
    subtitle: '',
    cta: 'Shop Bestsellers',
    image: hero3,
  },
  {
    id: 4,
    title: 'Fresh Styles Just Dropped — Grab Yours Before They\'re Gone!',
    subtitle: '',
    cta: 'Shop Bestsellers',
    image: hero4,
  },
  {
    id: 5,
    title: 'Join Thousands Who Upgraded Their Wardrobe Today',
    subtitle: '',
    cta: 'Shop Bestsellers',
    image: hero5,
  },
];

export const fetchCategoryTiles = () => [
  {
    id: 'men',
    label: 'Men',
    image: menCategory,
    accent: '#a5b4b4',
  },
  {
    id: 'women',
    label: 'Women',
    image: womenCategory,
    accent: '#d5c5bc',
  },
  {
    id: 'kids',
    label: 'Kids',
    image: kidsCategory,
    accent: '#fbd5c0',
  },
];

export const fetchFeaturedProducts = () =>
  Array.from({ length: 6 }).map((_, idx) => ({
    id: `fp-${idx}`,
    name: ['Sculpt Knit Blazer', 'Featherweight Trench', 'Contour Knit Dress', 'Drift Pleat Trouser', 'Muse Silk Shirt', 'Cloud Runner'][idx],
    price: ['$240', '$320', '$180', '$210', '$190', '$160'][idx],
    primary: placeholder(['photo-1503341455253-b2e723bb3dbb', 'photo-1483985988355-763728e1935b', 'photo-1521572163474-6864f9cf17ab', 'photo-1500530855697-b586d89ba3ee', 'photo-1504593811423-6dd665756598', 'photo-1490111718993-d98654ce6cf7'][idx]),
    alternate: placeholder(['photo-1500534314209-a25ddb2bd429', 'photo-1524504388940-b1c1722653e1', 'photo-1524504388940-b1c1722653e1', 'photo-1492562080023-ab3db95bfbce', 'photo-1492562080023-ab3db95bfbce', 'photo-1487412720507-e7ab37603c6f'][idx]),
    tag: ['New', 'Limited', 'Bestseller', 'Exclusive', 'New', 'Back in stock'][idx],
  }));

export const fetchTrendingOutfits = () =>
  Array.from({ length: 8 }).map((_, idx) => ({
    id: `trend-${idx}`,
    title: ['Street Lens', 'Resort Calm', 'Work Remix', 'Sculpt Studio', 'Monochrome Ease', 'Garden Bloom', 'City Drift', 'Weekend Knit'][idx],
    tag: ['Street', 'Resort', 'Work', 'Studio', 'Monochrome', 'Floral', 'Urban', 'Casual'][idx],
    image: placeholder(['photo-1504593811423-6dd665756598', 'photo-1487412720507-e7ab37603c6f', 'photo-1521572163474-6864f9cf17ab', 'photo-1500534314209-a25ddb2bd429', 'photo-1434389677669-e08b4cac3105', 'photo-1475180098004-ca77a66827be', 'photo-1492562080023-ab3db95bfbce', 'photo-1503341455253-b2e723bb3dbb'][idx]),
  }));







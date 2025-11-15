const placeholder = (path) =>
  `https://images.unsplash.com/${path}?auto=format&fit=crop&w=1600&q=80`;

export const fetchHeroSlides = () => [
  {
    id: 1,
    title: 'New Nordic Layers',
    subtitle: 'Elevate everyday staples with sculpted tailoring.',
    cta: 'Shop Now',
    image: placeholder('photo-1475180098004-ca77a66827be'),
  },
  {
    id: 2,
    title: 'Soft Pastel Resort',
    subtitle: 'Airy silhouettes & sunkissed palettes land today.',
    cta: 'Explore Collection',
    image: placeholder('photo-1487412720507-e7ab37603c6f'),
  },
  {
    id: 3,
    title: 'City Night Edit',
    subtitle: 'Monochrome textures for after-dark statements.',
    cta: 'Shop Now',
    image: placeholder('photo-1434389677669-e08b4cac3105'),
  },
];

export const fetchCategoryTiles = () => [
  {
    id: 'men',
    label: 'Men',
    image: placeholder('photo-1521572163474-6864f9cf17ab'),
    accent: '#a5b4b4',
  },
  {
    id: 'women',
    label: 'Women',
    image: placeholder('photo-1518544801958-efcbf8a7ec10'),
    accent: '#d5c5bc',
  },
  {
    id: 'kids',
    label: 'Kids',
    image: placeholder('photo-1504593811423-6dd665756598'),
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







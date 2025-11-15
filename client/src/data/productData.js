// Product data mapping for search terms and categories

const generateProducts = (baseName, count, basePrice = 2000, category = '') => {
  const products = [];
  for (let i = 1; i <= count; i++) {
    const imageName = category 
      ? `${baseName.toLowerCase()}${i}.png`
      : `${baseName.toLowerCase()}${i}.png`;
    
    const price = basePrice + (i * 100);
    const originalPrice = price * 2;
    const discount = Math.floor((1 - price / originalPrice) * 100);
    
    products.push({
      id: `${baseName.toLowerCase()}-${i}`,
      name: `${baseName} ${i}`,
      brand: getBrandForProduct(baseName),
      image: `/src/images/${imageName}`,
      price: `₹${price.toLocaleString('en-IN')}`,
      originalPrice: `₹${originalPrice.toLocaleString('en-IN')}`,
      discount: discount,
      color: getColorForProduct(i),
      assured: true,
    });
  }
  return products;
};

const getBrandForProduct = (productName) => {
  const brands = {
    'Tuxedo': 'PETER ENGLAND',
    'Kurta': 'FABINDIA',
    'T Shirt': 'H&M',
    'Shirt': 'VAN HEUSEN',
    'Sherwani': 'MANYAVAR',
    'Hoodie': 'NIKE',
    'Saree': 'SOCH',
    'Anarkali': 'BIBAA',
    'Dress': 'ZARA',
    'Top': 'H&M',
    'Lehenga': 'MANISH MALHOTRA',
  };
  return brands[productName] || 'BRAND';
};

const getColorForProduct = (index) => {
  const colors = ['Blue', 'Light Blue', 'Green', 'Black', 'Navy', 'Grey', 'White', 'Maroon', 'Red', 'Pink'];
  return colors[(index - 1) % colors.length];
};

// Search term to product mapping
export const getProductsBySearchTerm = (searchTerm) => {
  const term = searchTerm.toLowerCase().trim();
  
  // Map search suggestions to actual product types
  const searchMap = {
    't shirt': 'tshirt',
    't-shirt': 'tshirt',
    'tshirt': 'tshirt',
    'kurta': 'kurta',
    'lehenga': 'lehenga',
    'tuxedo': 'tuxedo',
    'saree': 'saree',
    'jeans': 'jeans',
    'dress': 'dress',
    'shirt': 'shirt',
    'sherwani': 'sherwani',
    'anarkali': 'anarkali',
    'hoodie': 'hoodie',
    'top': 'top',
  };

  const productType = searchMap[term];
  if (!productType) return [];

  // Get image count from available images
  const imageCounts = {
    tuxedo: 11,
    kurta: 7,
    lehenga: 6,
    saree: 8,
    dress: 5,
    anarkali: 4,
    tshirt: 8,
    shirt: 8,
    sherwani: 6,
    hoodie: 5,
    top: 5,
    jeans: 6,
  };

  const count = imageCounts[productType] || 5;
  const baseName = productType === 'tshirt' ? 'T Shirt' : 
                   productType.charAt(0).toUpperCase() + productType.slice(1);

  return generateProducts(baseName, count, 2000);
};

// Category to products mapping
export const getProductsByCategory = (category) => {
  const cat = category.toLowerCase();
  
  if (cat === 'men') {
    return [
      ...generateProducts('Tuxedo', 11, 3000),
      ...generateProducts('Kurta', 7, 1500),
      ...generateProducts('T Shirt', 8, 800),
      ...generateProducts('Sherwani', 6, 5000),
      ...generateProducts('Hoodie', 5, 1200),
    ];
  }
  
  if (cat === 'women') {
    return [
      ...generateProducts('Saree', 8, 2500),
      ...generateProducts('Anarkali', 4, 3000),
      ...generateProducts('Dress', 5, 2000),
      ...generateProducts('Top', 5, 1000),
    ];
  }
  
  if (cat === 'kids') {
    return generateProducts('Kids', 9, 800);
  }
  
  return [];
};


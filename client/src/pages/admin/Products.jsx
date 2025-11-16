import { useState, useEffect } from 'react';
// import api from '../../utils/api'; // API import is commented out as we are using local data
import { motion } from 'framer-motion';
import Skeleton from '../../components/admin/Skeleton';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { Package, Plus, Edit, Trash2 } from 'lucide-react';

// ====================================================================
// 1. DUMMY DATA IMPORTS (PATHS CORRECTED to '../../images/...')
// Assumes structure: src/pages/admin/Products.jsx -> src/images/
import hoodie1 from '../../images/hoodie1.png';
import hoodie2 from '../../images/hoodie2.png';
import hoodie3 from '../../images/hoodie3.png';
import hoodie4 from '../../images/hoodie4.png';
import hoodie5 from '../../images/hoodie5.png';
import jeans1 from '../../images/Jeans1.png';
import jeans2 from '../../images/Jeans2.png';
import tuxedo1 from '../../images/tuxedo1.png';
import tuxedo2 from '../../images/tuxedo2.png';
import tuxedo3 from '../../images/tuxedo3.png';
import tuxedo4 from '../../images/tuxedo4.png';
import tuxedo5 from '../../images/tuxedo5.png';
import kurta1 from '../../images/Kurta1.png';
import kurta2 from '../../images/Kurta2.png';
import kurta3 from '../../images/Kurta3.png';
import kurta4 from '../../images/Kurta4.png';
import kurta5 from '../../images/Kurta5.png';
import dress1 from '../../images/Dress1.png';
import dress2 from '../../images/Dress2.png';
import dress3 from '../../images/Dress3.png';
import dress4 from '../../images/Dress4.png';
import dress5 from '../../images/Dress5.png';
import shirt1 from '../../images/Shirt1.png';
import shirt2 from '../../images/Shirt2.png';
import shirt3 from '../../images/Shirt3.png';
import shirt4 from '../../images/Shirt4.png';
import shirt5 from '../../images/Shirt5.png';
import lehenga1 from '../../images/lehenga1.png';
import lehenga2 from '../../images/lehenga2.png';
import lehenga3 from '../../images/lehenga3.png';
import lehenga4 from '../../images/lehenga4.png';
import lehenga5 from '../../images/lehenga5.png';

// 2. DUMMY CATEGORY STRUCTURE
// Prices/Stock are mocked, but images and categories match your input data structure.
const localCategoriesData = [
  {
    name: 'Casual',
    _id: 'cat-casual',
    items: [
      { _id: 'casual-1', name: 'Casual Look 1', price: 49.99, stock: 150, images: [{ url: hoodie1 }], category: { _id: 'cat-casual', name: 'Casual' } },
      { _id: 'casual-2', name: 'Casual Look 2', price: 59.99, stock: 0, images: [{ url: hoodie2 }], category: { _id: 'cat-casual', name: 'Casual' } },
      { _id: 'casual-3', name: 'Casual Look 3', price: 34.50, stock: 75, images: [{ url: hoodie3 }], category: { _id: 'cat-casual', name: 'Casual' } },
      { _id: 'casual-4', name: 'Casual Look 4', price: 65.00, stock: 10, images: [{ url: hoodie4 }], category: { _id: 'cat-casual', name: 'Casual' } },
      { _id: 'casual-5', name: 'Casual Look 5', price: 55.50, stock: 0, images: [{ url: hoodie5 }], category: { _id: 'cat-casual', name: 'Casual' } },
      { _id: 'casual-6', name: 'Casual Look 6 (Jeans)', price: 79.99, stock: 200, images: [{ url: jeans1 }], category: { _id: 'cat-casual', name: 'Casual' } },
      { _id: 'casual-7', name: 'Casual Look 7 (Jeans)', price: 85.00, stock: 120, images: [{ url: jeans2 }], category: { _id: 'cat-casual', name: 'Casual' } },
    ],
  },
  {
    name: 'Formal',
    _id: 'cat-formal',
    items: [
      { _id: 'formal-1', name: 'Formal Look 1 (Tuxedo)', price: 299.00, stock: 40, images: [{ url: tuxedo1 }], category: { _id: 'cat-formal', name: 'Formal' } },
      { _id: 'formal-2', name: 'Formal Look 2 (Tuxedo)', price: 350.00, stock: 15, images: [{ url: tuxedo2 }], category: { _id: 'cat-formal', name: 'Formal' } },
      { _id: 'formal-3', name: 'Formal Look 3 (Tuxedo)', price: 280.00, stock: 5, images: [{ url: tuxedo3 }], category: { _id: 'cat-formal', name: 'Formal' } },
      { _id: 'formal-4', name: 'Formal Look 4 (Tuxedo)', price: 310.00, stock: 25, images: [{ url: tuxedo4 }], category: { _id: 'cat-formal', name: 'Formal' } },
      { _id: 'formal-5', name: 'Formal Look 5 (Tuxedo)', price: 330.00, stock: 18, images: [{ url: tuxedo5 }], category: { _id: 'cat-formal', name: 'Formal' } },
    ],
  },
  {
    name: 'Traditional',
    _id: 'cat-traditional',
    items: [
      { _id: 'traditional-1', name: 'Traditional Kurta 1', price: 120.00, stock: 25, images: [{ url: kurta1 }], category: { _id: 'cat-traditional', name: 'Traditional' } },
      { _id: 'traditional-2', name: 'Traditional Kurta 2', price: 150.00, stock: 12, images: [{ url: kurta2 }], category: { _id: 'cat-traditional', name: 'Traditional' } },
      { _id: 'traditional-3', name: 'Traditional Kurta 3', price: 110.00, stock: 35, images: [{ url: kurta3 }], category: { _id: 'cat-traditional', name: 'Traditional' } },
      { _id: 'traditional-4', name: 'Traditional Kurta 4', price: 135.00, stock: 7, images: [{ url: kurta4 }], category: { _id: 'cat-traditional', name: 'Traditional' } },
      { _id: 'traditional-5', name: 'Traditional Kurta 5', price: 105.00, stock: 42, images: [{ url: kurta5 }], category: { _id: 'cat-traditional', name: 'Traditional' } },
    ],
  },
  {
    name: 'Party',
    _id: 'cat-party',
    items: [
      { _id: 'party-1', name: 'Party Dress 1', price: 180.50, stock: 55, images: [{ url: dress1 }], category: { _id: 'cat-party', name: 'Party' } },
      { _id: 'party-2', name: 'Party Dress 2', price: 210.00, stock: 30, images: [{ url: dress2 }], category: { _id: 'cat-party', name: 'Party' } },
      { _id: 'party-3', name: 'Party Dress 3', price: 195.00, stock: 10, images: [{ url: dress3 }], category: { _id: 'cat-party', name: 'Party' } },
      { _id: 'party-4', name: 'Party Dress 4', price: 220.00, stock: 0, images: [{ url: dress4 }], category: { _id: 'cat-party', name: 'Party' } },
      { _id: 'party-5', name: 'Party Dress 5', price: 175.00, stock: 45, images: [{ url: dress5 }], category: { _id: 'cat-party', name: 'Party' } },
    ],
  },
  {
    name: 'Work',
    _id: 'cat-work',
    items: [
      { _id: 'work-1', name: 'Work Shirt 1', price: 75.00, stock: 90, images: [{ url: shirt1 }], category: { _id: 'cat-work', name: 'Work' } },
      { _id: 'work-2', name: 'Work Shirt 2', price: 85.00, stock: 60, images: [{ url: shirt2 }], category: { _id: 'cat-work', name: 'Work' } },
      { _id: 'work-3', name: 'Work Shirt 3', price: 70.00, stock: 110, images: [{ url: shirt3 }], category: { _id: 'cat-work', name: 'Work' } },
      { _id: 'work-4', name: 'Work Shirt 4', price: 90.00, stock: 5, images: [{ url: shirt4 }], category: { _id: 'cat-work', name: 'Work' } },
      { _id: 'work-5', name: 'Work Shirt 5', price: 80.00, stock: 80, images: [{ url: shirt5 }], category: { _id: 'cat-work', name: 'Work' } },
    ],
  },
  {
    name: 'Festive',
    _id: 'cat-festive',
    items: [
      { _id: 'festive-1', name: 'Festive Lehenga 1', price: 350.00, stock: 30, images: [{ url: lehenga1 }], category: { _id: 'cat-festive', name: 'Festive' } },
      { _id: 'festive-2', name: 'Festive Lehenga 2', price: 420.00, stock: 15, images: [{ url: lehenga2 }], category: { _id: 'cat-festive', name: 'Festive' } },
      { _id: 'festive-3', name: 'Festive Lehenga 3', price: 380.00, stock: 22, images: [{ url: lehenga3 }], category: { _id: 'cat-festive', name: 'Festive' } },
      { _id: 'festive-4', name: 'Festive Lehenga 4', price: 450.00, stock: 8, images: [{ url: lehenga4 }], category: { _id: 'cat-festive', name: 'Festive' } },
      { _id: 'festive-5', name: 'Festive Lehenga 5', price: 395.00, stock: 19, images: [{ url: lehenga5 }], category: { _id: 'cat-festive', name: 'Festive' } },
    ],
  },
];
// ====================================================================

// NOTE: The AddEditProductModal manages temporary local state only.
const AddEditProductModal = ({ isOpen, onClose, onSave, product, categories }) => {
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', stock: '', category: '', images: [],
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name, description: product.description || '', price: String(product.price),
        stock: String(product.stock), category: product.category?._id || '', images: product.images || [],
      });
    } else {
      setFormData({ name: '', description: '', price: '', stock: '', category: '', images: [] });
    }
  }, [product]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value) => {
    setFormData({ ...formData, category: value });
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (files.length === 0) return;

    setUploading(true);
    // Simulate successful image upload
    setTimeout(() => {
        const dummyImageUrls = Array.from(files).map((file) => ({
            url: URL.createObjectURL(file),
        }));
        setFormData({ ...formData, images: [...formData.images, ...dummyImageUrls] });
        setUploading(false);
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription>
            {product ? 'Edit the details of this product.' : 'Fill in the details to add a new product.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <Input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required />
          <Textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
          <Input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required />
          <Input type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleChange} required />
          <Select onValueChange={handleSelectChange} value={formData.category} required>
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Images</label>
            <Input type="file" multiple onChange={handleImageUpload} />
            {uploading && <p className="text-sm text-muted-foreground mt-1">Uploading...</p>}
            <div className="mt-2 flex gap-2 flex-wrap">
              {formData.images.map((img, index) => (
                <img key={index} src={img.url} alt="product" className="w-16 h-16 rounded object-cover border" />
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Fetch products from local data (Flattened list)
  const fetchProducts = () => {
    setLoading(true);
    const allProducts = localCategoriesData.flatMap(category => category.items);

    setTimeout(() => {
        setProducts(allProducts);
        setLoading(false);
    }, 500);
  };

  // Fetch categories from local data
  const fetchCategories = () => {
    const allCategories = localCategoriesData.map(cat => ({
        _id: cat._id,
        name: cat.name
    }));

    setTimeout(() => {
        setCategories(allCategories);
    }, 500);
  };

  // Handle local state updates for saving
  const handleSaveProduct = (productData) => {
    let updatedProducts;
    const categoryName = categories.find(c => c._id === productData.category)?.name;

    if (editingProduct) {
      updatedProducts = products.map(p =>
        p._id === editingProduct._id
          ? {
              ...p,
              ...productData,
              category: { _id: productData.category, name: categoryName }
            }
          : p
      );
    } else {
      const newId = `temp-${Date.now()}`;
      const newProduct = {
        ...productData,
        _id: newId,
        category: { _id: productData.category, name: categoryName }
      };
      updatedProducts = [...products, newProduct];
    }
    setProducts(updatedProducts);
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  // Handle local state updates for deleting
  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const updatedProducts = products.filter(p => p._id !== productId);
      setProducts(updatedProducts);
    }
  };

  const openModalToAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openModalToEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <AddEditProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
        categories={categories}
      />

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Manage Products</CardTitle>
          <Button onClick={openModalToAdd}>
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <Skeleton className="h-12 w-12 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="w-16 h-16 mx-auto mb-4" />
              <h3 className="mt-4 text-lg font-medium">No products found</h3>
              <p className="mt-1 text-sm">Create a new product to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right text-muted-foreground">
                <thead className="text-xs uppercase bg-muted">
                  <tr>
                    <th scope="col" className="px-6 py-3">Product</th>
                    <th scope="col" className="px-6 py-3">Category</th>
                    <th scope="col" className="px-6 py-3">Price</th>
                    <th scope="col" className="px-6 py-3">Stock</th>
                    <th scope="col" className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <motion.tr
                      key={product._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b hover:bg-muted"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {product.images?.[0]?.url && (
                            <img src={product.images[0].url} alt={product.name} className="w-10 h-10 rounded object-cover mr-3 border" />
                          )}
                          <span className="font-medium text-foreground">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{product.category?.name || 'N/A'}</td>
                      <td className="px-6 py-4 text-foreground">Rs. {product.price}</td>
                      <td className="px-6 py-4">
                        <span className={`font-medium ${product.stock > 0 ? 'text-emerald-500' : 'text-destructive'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 space-x-2">
                        <Button variant="outline" size="sm" onClick={() => openModalToEdit(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(product._id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductsPage;
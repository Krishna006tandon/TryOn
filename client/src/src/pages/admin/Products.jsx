import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { motion } from 'framer-motion';
import Skeleton from '../../components/admin/Skeleton';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';

import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/select'; // Assuming a Select component will be created
import { Textarea } from '../../components/ui/textarea'; // Assuming a Textarea component will be created
import { Package, Plus, Edit, Trash2, Upload } from 'lucide-react';

const AddEditProductModal = ({ isOpen, onClose, onSave, product, categories }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    images: [],
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category?._id || '',
        images: product.images || [],
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

    const imageFormData = new FormData();
    for (let i = 0; i < files.length; i++) {
      imageFormData.append('images', files[i]);
    }

    try {
      setUploading(true);
      const response = await api.post('/api/admin/upload/images', imageFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormData({ ...formData, images: [...formData.images, ...response.data.images] });
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
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

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/products?limit=20&populate=category');
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/admin/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        await api.put(`/api/admin/products/${editingProduct._id}`, productData);
      } else {
        await api.post('/api/admin/products', productData);
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/api/admin/products/${productId}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
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
                      <td className="px-6 py-4 text-foreground">${product.price}</td>
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
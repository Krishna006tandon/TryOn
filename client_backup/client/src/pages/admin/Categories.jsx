import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { motion } from 'framer-motion';
import Skeleton from '../../components/admin/Skeleton';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';
import { FolderTree, Plus, Edit, Trash2 } from 'lucide-react';

const AddEditCategoryModal = ({ isOpen, onClose, onSave, category }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description || '');
      setIsActive(category.isActive !== undefined ? category.isActive : true);
    } else {
      setName('');
      setDescription('');
      setIsActive(true);
    }
  }, [category]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, description, isActive });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{category ? 'Edit Category' : 'Add New Category'}</DialogTitle>
          <DialogDescription>
            {category ? 'Edit the details of this category.' : 'Fill in the details to add a new category.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <Input
            id="name"
            placeholder="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Textarea
            id="description"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="isActive" className="text-sm font-medium">
              Active (Products in this category will be visible)
            </label>
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

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/categories');
      if (response.data && Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        console.error('Invalid response format:', response.data);
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      if (error.response?.status === 404) {
        console.error('Categories endpoint not found. Check backend route configuration.');
        console.error('Expected endpoint: /api/admin/categories');
      }
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCategory = async (categoryData) => {
    try {
      if (editingCategory) {
        await api.put(`/admin/categories/${editingCategory._id}`, categoryData);
      } else {
        await api.post('/admin/categories', categoryData);
      }
      setIsModalOpen(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      alert(error.response?.data?.message || 'Failed to save category.');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category? All products in this category will be hidden.')) {
      try {
        const response = await api.delete(`/admin/categories/${categoryId}`);
        if (response.data?.hiddenProducts > 0) {
          alert(`Category deleted. ${response.data.hiddenProducts} product(s) have been hidden.`);
        }
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        alert(error.response?.data?.message || 'Failed to delete category.');
      }
    }
  };

  const openModalToAdd = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const openModalToEdit = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <AddEditCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCategory}
        category={editingCategory}
      />

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Manage Categories</CardTitle>
          <Button onClick={openModalToAdd}>
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="p-6 rounded-lg border bg-muted">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FolderTree className="w-16 h-16 mx-auto mb-4" />
              <h3 className="mt-4 text-lg font-medium">No categories found</h3>
              <p className="mt-1 text-sm">Create a new category to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-lg border bg-card shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      category.isActive !== false 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {category.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{category.description || 'No description'}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openModalToEdit(category)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteCategory(category._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CategoriesPage;
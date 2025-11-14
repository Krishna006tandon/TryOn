import { useState, useEffect } from 'react';
import api from '../../utils/api';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/admin/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Manage Categories</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Add Category
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading categories...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div key={category._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{category.description || 'No description'}</p>
              <div className="flex gap-2">
                <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                <button className="text-red-600 hover:text-red-800 text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;


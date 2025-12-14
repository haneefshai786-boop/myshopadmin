
import { useEffect, useState } from 'react';
import api from '../api.js';

export default function Categories({ vendorId }) {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    if (!vendorId) return;
    api.get(`/categories/vendor/${vendorId}`)
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, [vendorId]);

  const addCategory = async () => {
    if (!name) return;
    try {
      const res = await api.post(`/categories`, { name, vendor: vendorId });
      setCategories([...categories, res.data]);
      setName('');
    } catch (err) {
      console.error(err);
    }
  };

  const updateCategory = async (id) => {
    const newName = prompt('Enter new category name:');
    if (!newName) return;
    try {
      await api.put(`/categories/${id}`, { name: newName });
      setCategories(categories.map(c => c._id === id ? { ...c, name: newName } : c));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCategory = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await api.delete(`/categories/${id}`);
      setCategories(categories.filter(c => c._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 min-h-screen bg-gray-100">
      <h1 className="text-xl font-bold mb-4">Categories</h1>

      <div className="mb-4 flex gap-2">
        <input
          className="border p-2 flex-1"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          onClick={addCategory}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Add
        </button>
      </div>

      <div className="overflow-y-auto max-h-[70vh]">
        {categories.length === 0 ? (
          <p className="text-gray-500">No categories found for this vendor.</p>
        ) : (
          categories.map(c => (
            <div
              key={c._id}
              className="bg-white p-3 mb-2 flex justify-between items-center shadow rounded"
            >
              <span>{c.name}</span>
              <div className="space-x-3">
                <button onClick={() => updateCategory(c._id)} className="text-blue-600">Edit</button>
                <button onClick={() => deleteCategory(c._id)} className="text-red-600">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

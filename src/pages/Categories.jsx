import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

export default function Categories() {
  const { vendorId } = useParams(); // get vendorId from URL
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");

  const loadCategories = async () => {
    if (!vendorId) return;
    const { data } = await api.get(`/categories?vendor=${vendorId}`);
    setCategories(data);
  };

  useEffect(() => {
    loadCategories();
  }, [vendorId]);

  const addCategory = async () => {
    if (!name) return;
    await api.post("/categories", { name, vendor: vendorId });
    setName("");
    loadCategories();
  };

  const updateCategory = async (id) => {
    await api.put(`/categories/${id}`, { name: "Updated Category" });
    loadCategories();
  };

  const deleteCategory = async (id) => {
    await api.delete(`/categories/${id}`);
    loadCategories();
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Categories</h1>

      <div className="flex gap-2 mb-4">
        <input
          className="border p-2"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={addCategory} className="bg-blue-600 text-white px-4">
          Add
        </button>
      </div>

      {categories.length === 0 ? (
        <p>No categories found for this vendor.</p>
      ) : (
        categories.map((c) => (
          <div
            key={c._id}
            className="bg-white p-3 mb-2 flex justify-between"
          >
            <span>{c.name}</span>
            <div className="space-x-3">
              <button
                onClick={() => updateCategory(c._id)}
                className="text-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => deleteCategory(c._id)}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

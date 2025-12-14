
import { useEffect, useState } from "react";
import api from "../api.js";

export default function Categories() {
  const [vendors, setVendors] = useState([]);
  const [vendorId, setVendorId] = useState("");
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingName, setEditingName] = useState("");

  // Load vendors
  useEffect(() => {
    api.get("/vendors")
      .then(res => setVendors(res.data))
      .catch(() => alert("Failed to load vendors"));
  }, []);

  // Load categories when vendor changes
  useEffect(() => {
    if (!vendorId) {
      setCategories([]);
      return;
    }

    api.get(`/categories/vendor/${vendorId}`)
      .then(res => setCategories(res.data))
      .catch(() => setCategories([]));
  }, [vendorId]);

  // Add category
  const addCategory = async () => {
    if (!name || !vendorId) {
      alert("Select vendor & enter category name");
      return;
    }

    try {
      await api.post("/categories", {
        name,
        vendor: vendorId
      });

      setName("");
      const res = await api.get(`/categories/vendor/${vendorId}`);
      setCategories(res.data);
    } catch {
      alert("Failed to add category");
    }
  };

  // Delete category
  const deleteCategory = async (id) => {
    if (!confirm("Delete category?")) return;

    try {
      await api.delete(`/categories/${id}`);
      setCategories(categories.filter(c => c._id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  // Start editing
  const startEdit = (category) => {
    setEditingCategoryId(category._id);
    setEditingName(category.name);
  };

  // Save edit
  const saveEdit = async () => {
    if (!editingName) return;

    try {
      await api.put(`/categories/${editingCategoryId}`, { name: editingName });
      const res = await api.get(`/categories/vendor/${vendorId}`);
      setCategories(res.data);
      setEditingCategoryId(null);
      setEditingName("");
    } catch {
      alert("Update failed");
    }
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingCategoryId(null);
    setEditingName("");
  };

  return (
    <div>
      <h2>Categories</h2>

      {/* Select Vendor */}
      <select
        value={vendorId}
        onChange={(e) => setVendorId(e.target.value)}
      >
        <option value="">-- Select Vendor --</option>
        {vendors.map(v => (
          <option key={v._id} value={v._id}>{v.name}</option>
        ))}
      </select>

      <br /><br />

      {/* Add Category */}
      {vendorId && !editingCategoryId && (
        <div style={{ border: "1px solid #ccc", padding: 15, marginBottom: 20 }}>
          <input
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={addCategory} style={{ marginLeft: 10 }}>
            Add Category
          </button>
        </div>
      )}

      {/* Category List */}
      <div style={{ display: "grid", gap: 10 }}>
        {categories.map(c => (
          <div
            key={c._id}
            style={{ border: "1px solid #ccc", padding: 10, borderRadius: 6 }}
          >
            {editingCategoryId === c._id ? (
              <>
                <input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                />
                <button onClick={saveEdit} style={{ marginLeft: 10 }}>Save</button>
                <button onClick={cancelEdit} style={{ marginLeft: 5 }}>Cancel</button>
              </>
            ) : (
              <>
                <h4>{c.name}</h4>
                <button onClick={() => startEdit(c)}>Edit</button>
                <button onClick={() => deleteCategory(c._id)} style={{ marginLeft: 5 }}>Delete</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

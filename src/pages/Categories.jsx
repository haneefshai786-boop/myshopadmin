import { useEffect, useState } from "react";
import api from "../api.js";

export default function Categories() {
  const [vendors, setVendors] = useState([]);
  const [vendorId, setVendorId] = useState("");
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");

  // load vendors
  useEffect(() => {
    api.get("/vendors")
      .then(res => setVendors(res.data))
      .catch(() => alert("Failed to load vendors"));
  }, []);

  // load categories when vendor changes
  useEffect(() => {
    if (!vendorId) return;

    api.get(`/categories/vendor/${vendorId}`)
      .then(res => setCategories(res.data))
      .catch(() => setCategories([]));
  }, [vendorId]);

  const addCategory = async () => {
    if (!name || !vendorId) {
      alert("Select vendor & enter name");
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

  const deleteCategory = async (id) => {
    if (!confirm("Delete category?")) return;

    try {
      await api.delete(`/categories/${id}`);
      setCategories(categories.filter(c => c._id !== id));
    } catch {
      alert("Delete failed");
    }
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
          <option key={v._id} value={v._id}>
            {v.name}
          </option>
        ))}
      </select>

      <br /><br />

      {/* Add Category */}
      {vendorId && (
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
      {vendorId && (
        <table border="1" cellPadding="10" width="100%">
          <thead>
            <tr>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>
                  <button onClick={() => deleteCategory(c._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

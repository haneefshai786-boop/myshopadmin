import { useEffect, useState } from "react";
import api from "../api.js";

export default function Subcategories() {
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [vendorId, setVendorId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);

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
      setCategoryId("");
      setSubcategories([]);
      return;
    }

    api.get(`/categories/vendor/${vendorId}`)
      .then(res => setCategories(res.data))
      .catch(() => setCategories([]));
  }, [vendorId]);

  // Load subcategories when category changes
  useEffect(() => {
    if (!categoryId) {
      setSubcategories([]);
      return;
    }

    api.get(`/subcategories/category/${categoryId}`)
      .then(res => setSubcategories(res.data))
      .catch(() => setSubcategories([]));
  }, [categoryId]);

  const saveSubcategory = async () => {
    if (!name || !categoryId) {
      alert("Enter subcategory name & select category");
      return;
    }

    try {
      if (editingId) {
        await api.put(`/subcategories/${editingId}`, { name, category: categoryId });
        setEditingId(null);
      } else {
        await api.post("/subcategories", { name, category: categoryId });
      }

      setName("");
      const res = await api.get(`/subcategories/category/${categoryId}`);
      setSubcategories(res.data);
    } catch {
      alert("Failed to save subcategory");
    }
  };

  const editSubcategory = (s) => {
    setName(s.name);
    setEditingId(s._id);
  };

  const deleteSubcategory = async (id) => {
    if (!confirm("Delete subcategory?")) return;

    try {
      await api.delete(`/subcategories/${id}`);
      setSubcategories(subcategories.filter(s => s._id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div>
      <h2>Subcategories</h2>

      {/* Vendor select */}
      <select value={vendorId} onChange={e => setVendorId(e.target.value)}>
        <option value="">-- Select Vendor --</option>
        {vendors.map(v => (
          <option key={v._id} value={v._id}>{v.name}</option>
        ))}
      </select>

      {/* Category select */}
      <select
        value={categoryId}
        onChange={e => setCategoryId(e.target.value)}
        disabled={!vendorId}
        style={{ marginLeft: 10 }}
      >
        <option value="">-- Select Category --</option>
        {categories.map(c => (
          <option key={c._id} value={c._id}>{c.name}</option>
        ))}
      </select>

      <br /><br />

      {/* Add/Edit Subcategory */}
      {categoryId && (
        <div style={{ border: "1px solid #ccc", padding: 15, marginBottom: 20 }}>
          <input
            placeholder="Subcategory name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <button onClick={saveSubcategory} style={{ marginLeft: 10 }}>
            {editingId ? "Update" : "Add"} Subcategory
          </button>
          {editingId && (
            <button onClick={() => { setEditingId(null); setName(""); }} style={{ marginLeft: 10 }}>
              Cancel
            </button>
          )}
        </div>
      )}

      {/* Subcategories List */}
      <div style={{ display: "grid", gap: 10 }}>
        {subcategories.map(s => (
          <div key={s._id} style={{ border: "1px solid #ccc", padding: 10 }}>
            <h4>{s.name}</h4>
            <button onClick={() => editSubcategory(s)}>Edit</button>
            <button onClick={() => deleteSubcategory(s._id)} style={{ marginLeft: 10 }}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

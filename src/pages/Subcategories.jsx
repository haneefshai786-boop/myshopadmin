
import { useEffect, useState } from "react";
import api from "../api.js";

export default function Subcategories() {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [name, setName] = useState("");

  // Load categories
  useEffect(() => {
    api.get("/categories")
      .then(res => setCategories(res.data))
      .catch(() => alert("Failed to load categories"));
  }, []);

  // Load subcategories when category changes
  useEffect(() => {
    if (!categoryId) return;
    api.get(`/subcategories/category/${categoryId}`)
      .then(res => setSubcategories(res.data))
      .catch(() => setSubcategories([]));
  }, [categoryId]);

  const addSubcategory = async () => {
    if (!name || !categoryId) return alert("Select category & enter name");
    try {
      await api.post("/subcategories", { name, category: categoryId });
      setName("");
      const res = await api.get(`/subcategories/category/${categoryId}`);
      setSubcategories(res.data);
    } catch {
      alert("Failed to add subcategory");
    }
  };

  const updateSubcategory = async (id) => {
    const newName = prompt("Enter new name");
    if (!newName) return;
    try {
      const res = await api.put(`/subcategories/${id}`, { name: newName });
      setSubcategories(subcategories.map(s => s._id === id ? res.data : s));
    } catch {
      alert("Update failed");
    }
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

      <select value={categoryId} onChange={e => setCategoryId(e.target.value)}>
        <option value="">-- Select Category --</option>
        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
      </select>

      {categoryId && (
        <div style={{ marginTop: 20 }}>
          <input
            placeholder="Subcategory name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <button onClick={addSubcategory}>Add Subcategory</button>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        {subcategories.map(s => (
          <div key={s._id} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
            <span>{s.name}</span>
            <button style={{ marginLeft: 10 }} onClick={() => updateSubcategory(s._id)}>Edit</button>
            <button style={{ marginLeft: 10 }} onClick={() => deleteSubcategory(s._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
            }

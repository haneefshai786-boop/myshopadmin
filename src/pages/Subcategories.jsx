import { useEffect, useState } from "react";
import api from "../api.js";

export default function Subcategories() {
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [vendorId, setVendorId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");

  // load vendors
  useEffect(() => {
    api.get("/vendors")
      .then(res => setVendors(res.data))
      .catch(() => alert("Failed to load vendors"));
  }, []);

  // load categories when vendor changes
  useEffect(() => {
    if (!vendorId) {
      setCategories([]);
      setCategoryId("");
      return;
    }

    api.get(`/categories/vendor/${vendorId}`)
      .then(res => setCategories(res.data))
      .catch(() => setCategories([]));
  }, [vendorId]);

  // load subcategories when category changes
  useEffect(() => {
    if (!categoryId) {
      setSubcategories([]);
      return;
    }

    api.get(`/subcategories/category/${categoryId}`)
      .then(res => setSubcategories(res.data))
      .catch(() => setSubcategories([]));
  }, [categoryId]);

  const addSubcategory = async () => {
    if (!name || !categoryId) {
      alert("Enter name & select category");
      return;
    }

    try {
      await api.post("/subcategories", {
        name,
        category: categoryId
      });

      setName("");
      const res = await api.get(`/subcategories/category/${categoryId}`);
      setSubcategories(res.data);
    } catch {
      alert("Failed to add subcategory");
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

      {/* Vendor select */}
      <select value={vendorId} onChange={e => setVendorId(e.target.value)}>
        <option value="">-- Select Vendor --</option>
        {vendors.map(v => (
          <option key={v._id} value={v._id}>{v.name}</option>
        ))}
      </select>

      <br /><br />

      {/* Category select */}
      {categories.length > 0 && (
        <select value={categoryId} onChange={e => setCategoryId(e.target.value)}>
          <option value="">-- Select Category --</option>
          {categories.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
      )}

      <br /><br />

      {/* Add subcategory */}
      {categoryId && (
        <div style={{ border: "1px solid #ccc", padding: 15, marginBottom: 20 }}>
          <input
            placeholder="Subcategory name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <button onClick={addSubcategory} style={{ marginLeft: 10 }}>
            Add Subcategory
          </button>
        </div>
      )}

      {/* List */}
      {subcategories.length > 0 && (
        <table border="1" cellPadding="10" width="100%">
          <thead>
            <tr>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {subcategories.map(s => (
              <tr key={s._id}>
                <td>{s.name}</td>
                <td>
                  <button onClick={() => deleteSubcategory(s._id)}>
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

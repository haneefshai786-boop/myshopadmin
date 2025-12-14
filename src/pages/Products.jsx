
import { useEffect, useState } from "react";
import api from "../api.js";

export default function Products() {
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [vendorId, setVendorId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
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
      setSubcategoryId("");
      return;
    }

    api.get(`/subcategories/category/${categoryId}`)
      .then(res => setSubcategories(res.data))
      .catch(() => setSubcategories([]));
  }, [categoryId]);

  // Load products when subcategory changes
  useEffect(() => {
    if (!subcategoryId) {
      setProducts([]);
      return;
    }

    api.get(`/products/subcategory/${subcategoryId}`)
      .then(res => setProducts(res.data))
      .catch(() => setProducts([]));
  }, [subcategoryId]);

  const saveProduct = async () => {
    if (!name || !price || !subcategoryId) {
      alert("Fill all fields and select subcategory");
      return;
    }

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, {
          name, price, subcategory: subcategoryId
        });
        setEditingId(null);
      } else {
        await api.post("/products", {
          name, price, subcategory: subcategoryId
        });
      }

      setName("");
      setPrice("");
      const res = await api.get(`/products/subcategory/${subcategoryId}`);
      setProducts(res.data);
    } catch {
      alert("Failed to save product");
    }
  };

  const editProduct = (p) => {
    setName(p.name);
    setPrice(p.price);
    setEditingId(p._id);
  };

  const deleteProduct = async (id) => {
    if (!confirm("Delete product?")) return;

    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div>
      <h2>Products</h2>

      {/* Vendor Select */}
      <select value={vendorId} onChange={e => setVendorId(e.target.value)}>
        <option value="">-- Select Vendor --</option>
        {vendors.map(v => (
          <option key={v._id} value={v._id}>{v.name}</option>
        ))}
      </select>

      {/* Category Select */}
      <select value={categoryId} onChange={e => setCategoryId(e.target.value)} disabled={!vendorId}>
        <option value="">-- Select Category --</option>
        {categories.map(c => (
          <option key={c._id} value={c._id}>{c.name}</option>
        ))}
      </select>

      {/* Subcategory Select */}
      <select value={subcategoryId} onChange={e => setSubcategoryId(e.target.value)} disabled={!categoryId}>
        <option value="">-- Select Subcategory --</option>
        {subcategories.map(s => (
          <option key={s._id} value={s._id}>{s.name}</option>
        ))}
      </select>

      <br /><br />

      {subcategoryId && (
        <>
          {/* Add / Edit Product Form */}
          <div style={{ border: "1px solid #ccc", padding: 15, marginBottom: 20 }}>
            <input
              placeholder="Product Name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={e => setPrice(e.target.value)}
              style={{ marginLeft: 10 }}
            />
            <button onClick={saveProduct} style={{ marginLeft: 10 }}>
              {editingId ? "Update" : "Add"} Product
            </button>
            {editingId && (
              <button onClick={() => { setEditingId(null); setName(""); setPrice(""); }} style={{ marginLeft: 10 }}>
                Cancel
              </button>
            )}
          </div>

          {/* Products List */}
          <div style={{ display: "grid", gap: 10 }}>
            {products.map(p => (
              <div key={p._id} style={{ border: "1px solid #ccc", padding: 10 }}>
                <h4>{p.name}</h4>
                <p>₹{p.price}</p>
                <button onClick={() => editProduct(p)}>Edit</button>
                <button onClick={() => deleteProduct(p._id)} style={{ marginLeft: 10 }}>Delete</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

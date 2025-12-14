
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
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Load vendors
  useEffect(() => {
    api.get("/vendors").then(res => setVendors(res.data)).catch(() => alert("Failed to load vendors"));
  }, []);

  // Load categories when vendor changes
  useEffect(() => {
    if (!vendorId) {
      setCategories([]);
      setCategoryId("");
      setSubcategories([]);
      setSubcategoryId("");
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

  // Load products
  useEffect(() => {
    api.get("/products")
      .then(res => setProducts(res.data))
      .catch(() => setProducts([]));
  }, []);

  const saveProduct = async () => {
    if (!vendorId || !categoryId || !subcategoryId || !name || !price) {
      alert("Please fill all fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("vendor", vendorId);
      formData.append("category", categoryId);
      formData.append("subcategory", subcategoryId);
      if (image) formData.append("image", image);

      if (editingId) {
        await api.put(`/products/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        setEditingId(null);
      } else {
        await api.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }

      // Reset form
      setName("");
      setPrice("");
      setImage(null);

      // Reload products
      const res = await api.get("/products");
      setProducts(res.data);

    } catch (err) {
      console.error(err);
      alert("Failed to save product");
    }
  };

  const editProduct = (p) => {
    setName(p.name);
    setPrice(p.price);
    setVendorId(p.vendor?._id || "");
    setCategoryId(p.category?._id || "");
    setSubcategoryId(p.subcategory?._id || "");
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

      {/* Subcategory select */}
      <select
        value={subcategoryId}
        onChange={e => setSubcategoryId(e.target.value)}
        disabled={!categoryId}
        style={{ marginLeft: 10 }}
      >
        <option value="">-- Select Subcategory --</option>
        {subcategories.map(s => (
          <option key={s._id} value={s._id}>{s.name}</option>
        ))}
      </select>

      <br /><br />

      {/* Add/Edit Product */}
      {(vendorId && categoryId && subcategoryId) && (
        <div style={{ border: "1px solid #ccc", padding: 15, marginBottom: 20 }}>
          <input placeholder="Product name" value={name} onChange={e => setName(e.target.value)} />
          <input placeholder="Price" type="number" value={price} onChange={e => setPrice(e.target.value)} style={{ marginLeft: 10 }} />
          <input type="file" onChange={e => setImage(e.target.files[0])} style={{ marginLeft: 10 }} />
          <button onClick={saveProduct} style={{ marginLeft: 10 }}>
            {editingId ? "Update" : "Add"} Product
          </button>
          {editingId && (
            <button onClick={() => { setEditingId(null); setName(""); setPrice(""); setImage(null); }} style={{ marginLeft: 10 }}>
              Cancel
            </button>
          )}
        </div>
      )}

      {/* Product list */}
      <div style={{ display: "grid", gap: 10 }}>
        {products.map(p => (
          <div key={p._id} style={{ border: "1px solid #ccc", padding: 10 }}>
            <h4>{p.name}</h4>
            <p>Price: ${p.price}</p>
            <p>Vendor: {p.vendor?.name || "-"}</p>
            <p>Category: {p.category?.name || "-"}</p>
            <p>Subcategory: {p.subcategory?.name || "-"}</p>
            {p.image && <img src={p.image} alt={p.name} style={{ width: 100, marginTop: 5 }} />}
            <button onClick={() => editProduct(p)}>Edit</button>
            <button onClick={() => deleteProduct(p._id)} style={{ marginLeft: 10 }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

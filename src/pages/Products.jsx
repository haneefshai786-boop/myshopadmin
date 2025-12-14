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

  // Load vendors
  useEffect(() => {
    api.get("/vendors").then(res => setVendors(res.data));
  }, []);

  // Load categories when vendor changes
  useEffect(() => {
    if (!vendorId) return setCategories([]);
    api.get(`/categories/vendor/${vendorId}`).then(res => setCategories(res.data));
  }, [vendorId]);

  // Load subcategories when category changes
  useEffect(() => {
    if (!categoryId) return setSubcategories([]);
    api.get(`/subcategories/category/${categoryId}`).then(res => setSubcategories(res.data));
  }, [categoryId]);

  // Load all products
  const loadProducts = () => {
    api.get("/products").then(res => setProducts(res.data));
  };
  useEffect(loadProducts, []);

  const addProduct = async () => {
    if (!name || !price || !vendorId || !categoryId || !subcategoryId) {
      alert("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("vendor", vendorId);
    formData.append("category", categoryId);
    formData.append("subcategory", subcategoryId);
    if (image) formData.append("image", image);

    try {
      await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setName(""); setPrice(""); setImage(null);
      loadProducts();
    } catch {
      alert("Failed to save product");
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm("Delete product?")) return;
    await api.delete(`/products/${id}`);
    setProducts(products.filter(p => p._id !== id));
  };

  return (
    <div>
      <h2>Products</h2>

      {/* Vendor / Category / Subcategory */}
      <select value={vendorId} onChange={e => setVendorId(e.target.value)}>
        <option value="">-- Select Vendor --</option>
        {vendors.map(v => <option key={v._id} value={v._id}>{v.name}</option>)}
      </select>

      <select value={categoryId} onChange={e => setCategoryId(e.target.value)}>
        <option value="">-- Select Category --</option>
        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
      </select>

      <select value={subcategoryId} onChange={e => setSubcategoryId(e.target.value)}>
        <option value="">-- Select Subcategory --</option>
        {subcategories.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
      </select>

      <br /><br />
      <input placeholder="Product name" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Price" type="number" value={price} onChange={e => setPrice(e.target.value)} />
      <input type="file" onChange={e => setImage(e.target.files[0])} />
      <button onClick={addProduct}>Add Product</button>

      <hr />
      <h3>Product List</h3>
      <ul>
        {products.map(p => (
          <li key={p._id}>
            {p.name} - ${p.price} - {p.vendor?.name} / {p.category?.name} / {p.subcategory?.name}
            <button onClick={() => deleteProduct(p._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

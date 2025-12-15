import { useEffect, useState } from "react";
import api from "../api.js";

export default function Products() {
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [vendor, setVendor] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);

  // Load vendors
  useEffect(() => {
    api.get("/vendors").then(res => setVendors(res.data));
    api.get("/products").then(res => setProducts(res.data));
  }, []);

  // Load categories
  useEffect(() => {
    if (!vendor) return;
    api.get(`/categories/vendor/${vendor}`)
      .then(res => setCategories(res.data));
  }, [vendor]);

  // Load subcategories
  useEffect(() => {
    if (!category) return;
    api.get(`/subcategories/category/${category}`)
      .then(res => setSubcategories(res.data));
  }, [category]);

  const addProduct = async () => {
    if (!name || !price || !vendor || !category || !subcategory) {
      alert("All fields required");
      return;
    }

    const form = new FormData();
    form.append("name", name);
    form.append("price", price);
    form.append("vendor", vendor);
    form.append("category", category);
    form.append("subcategory", subcategory);
    if (image) form.append("image", image);

    try {
      await api.post("/products", form);
      alert("Product added");
      window.location.reload();
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

      <select onChange={e => setVendor(e.target.value)}>
        <option value="">Select Vendor</option>
        {vendors.map(v => <option key={v._id} value={v._id}>{v.name}</option>)}
      </select>

      <select onChange={e => setCategory(e.target.value)}>
        <option value="">Select Category</option>
        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
      </select>

      <select onChange={e => setSubcategory(e.target.value)}>
        <option value="">Select Subcategory</option>
        {subcategories.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
      </select>

      <input placeholder="Product name" onChange={e => setName(e.target.value)} />
      <input placeholder="Price" type="number" onChange={e => setPrice(e.target.value)} />
      <input type="file" onChange={e => setImage(e.target.files[0])} />

      <button onClick={addProduct}>Add Product</button>

      <hr />

      {products.map(p => (
        <div key={p._id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
          <b>{p.name}</b> – ₹{p.price}
          <br />
          {p.vendor?.name} / {p.category?.name} / {p.subcategory?.name}
          <br />
          <button onClick={() => deleteProduct(p._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

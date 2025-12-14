import { useEffect, useState } from "react";
import api from "../api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");

  const load = async () => {
    const { data } = await api.get("/products");
    setProducts(data);
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    await api.post("/products", { name });
    setName("");
    load();
  };

  const update = async (id) => {
    await api.put(`/products/${id}`, { name: "Updated Product" });
    load();
  };

  const remove = async (id) => {
    await api.delete(`/products/${id}`);
    load();
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Products</h1>

      <div className="flex gap-2 mb-4">
        <input
          className="border p-2"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button onClick={add} className="bg-blue-600 text-white px-3">
          Add
        </button>
      </div>

      {products.map(p => (
        <div key={p._id} className="bg-white p-3 mb-2 flex justify-between">
          <span>{p.name}</span>
          <div className="space-x-2">
            <button onClick={() => update(p._id)} className="text-blue-600">
              Edit
            </button>
            <button onClick={() => remove(p._id)} className="text-red-600">
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

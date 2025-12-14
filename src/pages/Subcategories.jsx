
import { useEffect, useState } from "react";
import api from "../api";

export default function Subcategories() {
  const [subcategories, setSubcategories] = useState([]);
  const [name, setName] = useState("");

  const loadSubcategories = async () => {
    const { data } = await api.get("/subcategories");
    setSubcategories(data);
  };

  useEffect(() => {
    loadSubcategories();
  }, []);

  const addSubcategory = async () => {
    if (!name) return;
    await api.post("/subcategories", { name });
    setName("");
    loadSubcategories();
  };

  const updateSubcategory = async (id) => {
    await api.put(`/subcategories/${id}`, {
      name: "Updated Subcategory"
    });
    loadSubcategories();
  };

  const deleteSubcategory = async (id) => {
    await api.delete(`/subcategories/${id}`);
    loadSubcategories();
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Subcategories</h1>

      <div className="flex gap-2 mb-4">
        <input
          className="border p-2"
          placeholder="Subcategory name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          onClick={addSubcategory}
          className="bg-blue-600 text-white px-4"
        >
          Add
        </button>
      </div>

      {subcategories.map((s) => (
        <div
          key={s._id}
          className="bg-white p-3 mb-2 flex justify-between"
        >
          <span>{s.name}</span>

          <div className="space-x-3">
            <button
              onClick={() => updateSubcategory(s._id)}
              className="text-blue-600"
            >
              Edit
            </button>
            <button
              onClick={() => deleteSubcategory(s._id)}
              className="text-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

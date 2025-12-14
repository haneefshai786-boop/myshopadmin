import { useEffect, useState } from "react";
import api from "../api.js";

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("restaurant");

  const fetchVendors = async () => {
    try {
      const res = await api.get("/vendors");
      setVendors(res.data);
    } catch (err) {
      alert("Failed to load vendors");
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const addVendor = async () => {
    if (!name || !description) {
      alert("All fields required");
      return;
    }

    try {
      await api.post("/vendors", {
        name,
        description,
        type,
      });

      setName("");
      setDescription("");
      setType("restaurant");
      fetchVendors();
    } catch (err) {
      alert("Failed to add vendor");
    }
  };

  const deleteVendor = async (id) => {
    if (!confirm("Delete this vendor?")) return;

    try {
      await api.delete(`/vendors/${id}`);
      fetchVendors();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div>
      <h2>Vendors</h2>

      {/* Add Vendor */}
      <div style={{ border: "1px solid #ccc", padding: 15, marginBottom: 20 }}>
        <h3>Add Vendor</h3>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        /><br /><br />

        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        /><br /><br />

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="restaurant">Restaurant</option>
          <option value="grocery">Grocery</option>
        </select><br /><br />

        <button onClick={addVendor}>Add Vendor</button>
      </div>

      {/* Vendor List */}
      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((v) => (
            <tr key={v._id}>
              <td>{v.name}</td>
              <td>{v.description}</td>
              <td>{v.type}</td>
              <td>
                <button onClick={() => deleteVendor(v._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import { useEffect, useState } from "react";
import api from "../api.js"; // make sure api.js has the correct baseURL for your backend

export default function Dashboard() {
  const [counts, setCounts] = useState({
    vendors: 0,
    products: 0,
    orders: 0
  });

  useEffect(() => {
    const loadCounts = async () => {
      try {
        // Replace endpoints if your backend uses /api/admin/ prefix
        const [vendorsRes, productsRes, ordersRes] = await Promise.all([
          api.get("/vendors"),       // ✅ or "/admin/vendors"
          api.get("/products"),      // ✅ or "/admin/products"
          api.get("/orders")         // ✅ or "/admin/orders"
        ]);

        setCounts({
          vendors: vendorsRes.data.length,
          products: productsRes.data.length,
          orders: ordersRes.data.length
        });
      } catch (e) {
        console.error("Error fetching dashboard counts:", e.response?.data || e.message);
      }
    };

    loadCounts();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginTop: 20 }}>
        <div style={{ border: "1px solid #ccc", padding: 20, borderRadius: 8 }}>
          <h3>Vendors</h3>
          <p>{counts.vendors}</p>
        </div>
        <div style={{ border: "1px solid #ccc", padding: 20, borderRadius: 8 }}>
          <h3>Products</h3>
          <p>{counts.products}</p>
        </div>
        <div style={{ border: "1px solid #ccc", padding: 20, borderRadius: 8 }}>
          <h3>Orders</h3>
          <p>{counts.orders}</p>
        </div>
      </div>
    </div>
  );
}

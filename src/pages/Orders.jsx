import { useEffect, useState } from "react";
import api from "../api.js";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data.reverse());
    } catch {
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      loadOrders();
    } catch {
      alert("Status update failed");
    }
  };

  if (loading) return <h3>Loading orders...</h3>;

  return (
    <div>
      <h2>Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <table border="1" cellPadding="10" width="100%">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Change Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order._id}</td>

                <td>
                  {order.items.map((i, idx) => (
                    <div key={idx}>
                      {i.name} × {i.qty} — ₹{i.price}
                    </div>
                  ))}
                </td>

                <td>₹{order.total}</td>

                <td>
                  <strong>{order.status || "Pending"}</strong>
                </td>

                <td>
                  <select
                    value={order.status || "Pending"}
                    onChange={e =>
                      updateStatus(order._id, e.target.value)
                    }
                  >
                    <option>Pending</option>
                    <option>Confirmed</option>
                    <option>Preparing</option>
                    <option>Out for delivery</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

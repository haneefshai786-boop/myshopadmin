import { Link, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-60 bg-slate-800 text-white p-4">
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>

        <nav className="space-y-2">
          <Link to="/" className="block hover:text-blue-400">Dashboard</Link>
          <Link to="/vendors">Vendors</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/subcategories">Subcategories</Link>
          <Link to="/products">Products</Link>
          <Link to="/orders">Orders</Link>
        </nav>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}

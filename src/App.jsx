import { Routes, Route } from 'react-router-dom';
import AdminLayout from './layout/AdminLayout.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Vendors from './pages/Vendors.jsx';
import Categories from './pages/Categories.jsx';
import Subcategories from './pages/Subcategories.jsx';
import Products from './pages/Products.jsx';
import Orders from './pages/Orders.jsx';

export default function App() {
  return (
    <Routes>
      {/* PUBLIC ROUTE */}
      <Route path="/login" element={<Login />} />

      {/* PROTECTED ROUTES */}
      <Route path="/" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="vendors" element={<Vendors />} />
        <Route path="categories" element={<Categories />} />
        <Route path="subcategories" element={<Subcategories />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
      </Route>
    </Routes>
  );
}

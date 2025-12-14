import { Link, useNavigate } from 'react-router-dom';

export default function AdminSidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <div
      style={{
        width: 220,
        background: '#1e293b',
        color: '#fff',
        padding: 16
      }}
    >
      <h2 style={{ color: '#38bdf8' }}>Admin</h2>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Link to="/" style={link}>Dashboard</Link>
        <Link to="/vendors" style={link}>Vendors</Link>
        <Link to="/orders" style={link}>Orders</Link>

        <button
          onClick={logout}
          style={{
            marginTop: 20,
            padding: 10,
            background: '#ef4444',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            borderRadius: 6
          }}
        >
          Logout
        </button>
      </nav>
    </div>
  );
}

const link = {
  color: '#fff',
  textDecoration: 'none',
  padding: '8px 0'
};

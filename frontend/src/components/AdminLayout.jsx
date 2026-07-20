import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo_uinar.png';

function AdminLayout({ children }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Logout error:', err);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div style={{ minHeight: '100vh', background: '#f7f9fc' }}>
      {/* Navbar Admin */}
      <div style={{
        background: 'linear-gradient(135deg, #1a3a5c 0%, #0f2540 100%)',
        padding: '0 32px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div
          onClick={() => navigate('/admin/dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <img src={logo} 
          alt="Logo" 
          style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '6px' }} />
          <span style={{ color: 'white', fontWeight: 700, fontSize: '15px' }}>
            Admin Panel — Tracer Study Kimia
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {user.nama && (
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
              Halo, <b style={{ color: 'white' }}>{user.nama}</b>
            </span>
          )}
          <button
            onClick={() => navigate('/admin/dashboard')}
            style={{
              padding: '7px 16px',
              background: 'transparent',
              color: 'rgba(255,255,255,0.8)',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            Dashboard
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: '7px 16px',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500
            }}
          >
            Logout
          </button>
          <a href="/" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', textDecoration: 'none' }}>
            ← Website
          </a>
        </div>
      </div>

      {/* Page Content */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
        {children}
      </div>
    </div>
  );
}

export default AdminLayout;
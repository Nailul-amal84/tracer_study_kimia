import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token) {
      navigate('/admin/login');
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const handleLogout = async () => {
    const token = localStorage.getItem('token');

    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (err) {
      console.error('Logout error:', err);
    }

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  return (
    <div style={{ padding: '32px' }}>
      {/* Header Dashboard */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid #ccc', paddingBottom: '16px' }}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>Dashboard Admin</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {user && <span>Halo, <b>{user.nama}</b></span>}
          <button
            onClick={handleLogout}
            style={{ padding: '8px 16px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Menu Kelola Konten */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
        <div
          onClick={() => navigate('/admin/faq')}
          style={{ padding: '24px', border: '1px solid #ccc', borderRadius: '8px', cursor: 'pointer', textAlign: 'center' }}
        >
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>❓</div>
          <div style={{ fontWeight: 'bold' }}>Kelola FAQ</div>
        </div>

        <div
          onClick={() => navigate('/admin/artikel')}
          style={{ padding: '24px', border: '1px solid #ccc', borderRadius: '8px', cursor: 'pointer', textAlign: 'center' }}
        >
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>📰</div>
          <div style={{ fontWeight: 'bold' }}>Kelola Artikel</div>
        </div>

        <div
          onClick={() => navigate('/admin/profil-alumni')}
          style={{ padding: '24px', border: '1px solid #ccc', borderRadius: '8px', cursor: 'pointer', textAlign: 'center' }}
        >
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>👥</div>
          <div style={{ fontWeight: 'bold' }}>Kelola Profil Alumni</div>
        </div>

        <div
          onClick={() => navigate('/admin/tentang')}
          style={{ padding: '24px', border: '1px solid #ccc', borderRadius: '8px', cursor: 'pointer', textAlign: 'center' }}
        >
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>ℹ️</div>
          <div style={{ fontWeight: 'bold' }}>Kelola Tentang</div>
        </div>

        <div
          onClick={() => navigate('/admin/tracer-study')}
          style={{ padding: '24px', border: '1px solid #ccc', borderRadius: '8px', cursor: 'pointer', textAlign: 'center' }}
        >
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>📋</div>
          <div style={{ fontWeight: 'bold' }}>Kelola Tracer Study</div>
        </div>

        <div
          onClick={() => navigate('/admin/laporan-saran')}
          style={{ padding: '24px', border: '1px solid #ccc', borderRadius: '8px', cursor: 'pointer', textAlign: 'center' }}
        >
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>📩</div>
          <div style={{ fontWeight: 'bold' }}>Lihat Pesan Masuk</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
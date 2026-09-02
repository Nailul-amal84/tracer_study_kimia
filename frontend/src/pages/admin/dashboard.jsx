import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import logo from '../../assets/logo_uinar.png';

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

  const menus = [
    { icon: '📰', label: 'Kelola Artikel', path: '/admin/artikel', desc: 'Tambah, edit, hapus artikel informasi' },
    { icon: '❓', label: 'Kelola FAQ', path: '/admin/faq', desc: 'Kelola pertanyaan yang sering ditanyakan' },
    { icon: '👥', label: 'Kelola Profil Alumni', path: '/admin/profil-alumni', desc: 'Tambah dan kelola profil alumni' },
    { icon: 'ℹ️', label: 'Kelola Tentang', path: '/admin/tentang', desc: 'Kelola struktur organisasi, surveyor, peneliti' },
    { icon: '📋', label: 'Kelola Tracer Study', path: '/admin/tracer-study', desc: 'Update link Google Form per jenis tracer' },
    { icon: '📩', label: 'Pesan Masuk', path: '/admin/laporan-saran', desc: 'Lihat laporan dan saran dari pengguna' },
    { icon: '📊', label: 'Kelola Data Survey', path: '/admin/data-survey', desc: 'Input data hasil survey per tahun lulus' },
  ];

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
        boxShadow: '0 2px 12px rgba(0,0,0,0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={logo} 
          alt="Logo" 
          style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '6px' }} />
          <span style={{ color: 'white', fontWeight: 700, fontSize: '15px' }}>Admin Panel — Tracer Study Kimia</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {user && (
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
              Halo, <b style={{ color: 'white' }}>{user.nama}</b>
            </span>
          )}
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

      {/* Content */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Welcome */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Dashboard Admin</h1>
          <p style={{ color: '#718096' }}>Selamat datang! Kelola konten website Tracer Study Kimia UINAR dari sini.</p>
        </div>

        {/* Menu Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '16px'
        }}>
          {menus.map((menu) => (
            <div
              key={menu.path}
              onClick={() => navigate(menu.path)}
              className="card"
              style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                e.currentTarget.style.borderColor = '#1a3a5c';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>{menu.icon}</div>
              <h3 style={{ marginBottom: '6px', color: '#1a3a5c' }}>{menu.label}</h3>
              <p style={{ fontSize: '13px', color: '#718096' }}>{menu.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
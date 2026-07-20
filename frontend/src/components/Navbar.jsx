import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo_uinar.png';

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const linkStyle = (path) => ({
    padding: '8px 14px',
    borderRadius: '6px',
    fontWeight: 500,
    fontSize: '15px',
    color: isActive(path) ? 'white' : 'rgba(255,255,255,0.85)',
    background: isActive(path) ? 'rgba(255,255,255,0.15)' : 'transparent',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    display: 'block',
  });

  const mobileLinkStyle = (path) => ({
    display: 'block',
    padding: '12px 16px',
    fontWeight: 500,
    fontSize: '15px',
    color: isActive(path) ? '#1a3a5c' : '#4a5568',
    background: isActive(path) ? '#ebf8ff' : 'transparent',
    textDecoration: 'none',
    borderRadius: '6px',
  });

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #1a3a5c 0%, #0f2540 100%)',
      boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <img src={logo} alt="Logo" style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '6px' }} />
          <span style={{ color: 'white', fontWeight: 700, fontSize: '16px' }}>Tracer Study Kimia</span>
        </Link>

        {/* Menu Desktop */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          className="desktop-menu">
          <Link to="/" style={linkStyle('/')}>Beranda</Link>

          {/* Dropdown Tentang */}
          <div
            style={{ position: 'relative' }}
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <span style={{
              ...linkStyle('/tentang'),
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              Tentang <span style={{ fontSize: '10px' }}>▾</span>
            </span>

            {dropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                background: 'white',
                borderRadius: '8px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                minWidth: '200px',
                padding: '8px',
                zIndex: 999,
              }}>
                {[
                  { to: '/tentang/struktur_organisasi', label: 'Struktur Organisasi' },
                  { to: '/tentang/surveyor', label: 'Surveyor' },
                  { to: '/tentang/peneliti', label: 'Peneliti' },
                ].map((item) => (
                  <Link key={item.to} to={item.to} style={{
                    display: 'block',
                    padding: '10px 14px',
                    color: '#2d3748',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: 500,
                    textDecoration: 'none',
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f7f9fc'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/tracer-study" style={linkStyle('/tracer-study')}>Tracer Study</Link>
          <Link to="/profil-alumni" style={linkStyle('/profil-alumni')}>Profil Alumni</Link>
          <Link to="/informasi" style={linkStyle('/informasi')}>Informasi</Link>
          <Link to="/laporan-saran" style={linkStyle('/laporan-saran')}>Laporan & Saran</Link>
          <Link to="/faq" style={linkStyle('/faq')}>FAQ</Link>
        </div>

        {/* Hamburger Button (mobile) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            color: 'white',
            fontSize: '24px',
          }}
          className="hamburger-btn"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          background: 'white',
          padding: '12px 16px',
          borderTop: '1px solid #e2e8f0',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          animation: 'slideDown 0.25s ease'
        }}
          className="mobile-menu"
        >
          <Link to="/" style={mobileLinkStyle('/')} onClick={() => setMenuOpen(false)}>Beranda</Link>

          {/* Tentang di Mobile */}
          <div style={{ padding: '12px 16px', fontWeight: 600, color: '#718096', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Tentang
          </div>
          {[
            { to: '/tentang/struktur_organisasi', label: 'Struktur Organisasi' },
            { to: '/tentang/surveyor', label: 'Surveyor' },
            { to: '/tentang/peneliti', label: 'Peneliti' },
          ].map((item) => (
            <Link key={item.to} to={item.to} style={{ ...mobileLinkStyle(item.to), paddingLeft: '28px', fontSize: '14px' }} onClick={() => setMenuOpen(false)}>
              {item.label}
            </Link>
          ))}

          <Link to="/tracer-study" style={mobileLinkStyle('/tracer-study')} onClick={() => setMenuOpen(false)}>Tracer Study</Link>
          <Link to="/profil-alumni" style={mobileLinkStyle('/profil-alumni')} onClick={() => setMenuOpen(false)}>Profil Alumni</Link>
          <Link to="/informasi" style={mobileLinkStyle('/informasi')} onClick={() => setMenuOpen(false)}>Informasi</Link>
          <Link to="/laporan-saran" style={mobileLinkStyle('/laporan-saran')} onClick={() => setMenuOpen(false)}>Laporan & Saran</Link>
          <Link to="/faq" style={mobileLinkStyle('/faq')} onClick={() => setMenuOpen(false)}>FAQ</Link>
        </div>
      )}

      {/* CSS untuk responsive */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (max-width: 768px) {
          .desktop-menu { display: none !important; }
          .hamburger-btn { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu { display: none !important; }
        }
      `}</style>
    </nav>
  );
}

export default Navbar;
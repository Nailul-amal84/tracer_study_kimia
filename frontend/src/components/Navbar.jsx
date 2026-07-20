import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logouinar from '../assets/logo_uinar.png';

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
          <img
            src={logouinar}
            alt="Logo UIN Ar-Raniry"
            style={{
              width: '75px',
              height: '75px',
              objectFit: 'contain'
            }}
          />
          <span style={{ color: 'white', fontWeight: 700, fontSize: '16px' }}>Tracer Study Kimia</span>
        </Link>

        {/* Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
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
      </div>
    </nav>
  );
}

export default Navbar;
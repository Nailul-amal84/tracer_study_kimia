import { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav>
      <Link to="/">Beranda</Link>
      {' | '}

      {/* Dropdown Tentang */}
      <span
        style={{ position: 'relative', cursor: 'pointer', color: 'inherit', textDecoration: 'underline' }}
        onMouseEnter={() => setDropdownOpen(true)}
        onMouseLeave={() => setDropdownOpen(false)}
      >
        Tentang ▾
        {dropdownOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            background: 'white',
            border: '1px solid #ccc',
            zIndex: 999,
            minWidth: '180px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}>
            <div><Link to="/tentang/struktur-organisasi" style={{ display: 'block', padding: '8px 12px' }}>Struktur Organisasi</Link></div>
            <div><Link to="/tentang/surveyor" style={{ display: 'block', padding: '8px 12px' }}>Surveyor</Link></div>
            <div><Link to="/tentang/peneliti" style={{ display: 'block', padding: '8px 12px' }}>Peneliti</Link></div>
          </div>
        )}
      </span>

      {' | '}
      <Link to="/faq">FAQ</Link>
      {' | '}
      <Link to="/laporan-saran">Laporan & Saran</Link>
      {' | '}
      <Link to="/profil-alumni">Profil Alumni</Link>
    </nav>
  );
}

export default Navbar;
import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo_uinar.png';

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  // Tutup search dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (q) => {
    setSearchQuery(q);
    if (q.length < 2) {
      setSearchResults([]);
      setSearchOpen(false);
      return;
    }
    setSearchLoading(true);
    setSearchOpen(true);
    try {
      const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(q)}`);
      const result = await res.json();
      if (result.success) setSearchResults(result.data);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleResultClick = (url) => {
    navigate(url);
    setSearchQuery('');
    setSearchResults([]);
    setSearchOpen(false);
  };

  const ikonPerType = {
    artikel: '📰',
    faq: '❓',
    alumni: '👨‍🎓'
  };

  const labelPerType = {
    artikel: 'Artikel',
    faq: 'FAQ',
    alumni: 'Alumni'
  };

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
        gap: '16px'
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
          <img src={logo} alt="Logo" style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '6px' }} />
          <span style={{ color: 'white', fontWeight: 700, fontSize: '16px' }}>Tracer Study Kimia</span>
        </Link>

        {/* Menu Desktop */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }} className="desktop-menu">
          <Link to="/" style={linkStyle('/')}>Beranda</Link>

          {/* Dropdown Tentang */}
          <div style={{ position: 'relative' }}
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <span style={{ ...linkStyle('/tentang'), cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Tentang <span style={{ fontSize: '10px' }}>▾</span>
            </span>
            {dropdownOpen && (
              <div style={{
                position: 'absolute', top: '100%', left: 0,
                background: 'white', borderRadius: '8px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                minWidth: '200px', padding: '8px', zIndex: 999,
              }}>
                {[
                  { to: '/tentang/struktur_organisasi', label: 'Struktur Organisasi' },
                  { to: '/tentang/surveyor', label: 'Surveyor' },
                  { to: '/tentang/peneliti', label: 'Peneliti' },
                ].map((item) => (
                  <Link key={item.to} to={item.to} style={{
                    display: 'block', padding: '10px 14px', color: '#2d3748',
                    borderRadius: '6px', fontSize: '14px', fontWeight: 500, textDecoration: 'none',
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

        {/* Tombol Login Admin */}
        <Link to="/admin/login" title="Login Admin" style={{
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px',
          padding: '6px 16px', 
          borderRadius: '20px',
          background: 'rgba(255,255,255,0.15)', 
          color: 'white',
          textDecoration: 'none', 
          fontSize: '14px',
          fontWeight: 600,
          flexSrhrink: 'none',
          whiteSpace: 'nowrap',
        }} className="desktop-menu">
          🔒 Login Admin
        </Link>

        {/* Search Bar */}
        <div ref={searchRef} style={{ position: 'relative', flexShrink: 0 }} className="desktop-menu">
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Cari..."
              style={{
                padding: '7px 14px 7px 36px',
                borderRadius: '20px',
                border: 'none',
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                fontSize: '14px',
                width: '180px',
                outline: 'none',
                transition: 'all 0.2s ease',
              }}
              onFocus={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.25)';
                e.target.style.width = '220px';
              }}
              onBlur={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.15)';
                e.target.style.width = '180px';
              }}
            />
            <span style={{
              position: 'absolute', left: '12px', top: '50%',
              transform: 'translateY(-50%)', fontSize: '14px', pointerEvents: 'none'
            }}>🔍</span>
          </div>

          {/* Dropdown Hasil Search */}
          {searchOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              background: 'white', borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              minWidth: '320px', maxWidth: '380px',
              zIndex: 999, overflow: 'hidden',
              animation: 'slideDown 0.2s ease'
            }}>
              {searchLoading ? (
                <div style={{ padding: '16px', textAlign: 'center', color: '#718096', fontSize: '14px' }}>
                  🔍 Mencari...
                </div>
              ) : searchResults.length === 0 ? (
                <div style={{ padding: '16px', textAlign: 'center', color: '#718096', fontSize: '14px' }}>
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>🔍</div>
                  Tidak ada hasil untuk "<b>{searchQuery}</b>"
                </div>
              ) : (
                <div>
                  <div style={{ padding: '10px 16px', fontSize: '12px', color: '#718096', borderBottom: '1px solid #e2e8f0', fontWeight: 600 }}>
                    {searchResults.length} hasil ditemukan
                  </div>
                  {searchResults.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => handleResultClick(item.url)}
                      style={{
                        padding: '12px 16px',
                        cursor: 'pointer',
                        borderBottom: index < searchResults.length - 1 ? '1px solid #f7f9fc' : 'none',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f7f9fc'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <span style={{ fontSize: '18px', flexShrink: 0 }}>{ikonPerType[item.type]}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                            <span style={{
                              fontSize: '10px', fontWeight: 700, color: '#2b6cb0',
                              background: '#ebf8ff', padding: '1px 6px', borderRadius: '8px',
                              textTransform: 'uppercase', letterSpacing: '0.3px'
                            }}>
                              {labelPerType[item.type]}
                            </span>
                          </div>
                          <div style={{
                            fontWeight: 600, color: '#1a3a5c', fontSize: '13px', marginBottom: '2px',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                          }}>
                            {item.judul}
                          </div>
                          {item.deskripsi && (
                            <div style={{
                              fontSize: '12px', color: '#718096',
                              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                            }}>
                              {item.deskripsi}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hamburger Button (mobile) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none', background: 'none', border: 'none',
            cursor: 'pointer', padding: '8px', color: 'white', fontSize: '24px',
          }}
          className="hamburger-btn"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          background: 'white', padding: '12px 16px',
          borderTop: '1px solid #e2e8f0',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          animation: 'slideDown 0.25s ease'
        }} className="mobile-menu">
          {/* Search Mobile */}
          <div style={{ padding: '8px 0 12px', borderBottom: '1px solid #e2e8f0', marginBottom: '8px' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="🔍 Cari artikel, FAQ, alumni..."
              style={{
                width: '100%', padding: '10px 14px',
                borderRadius: '8px', border: '1px solid #e2e8f0',
                fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                color: '#2d3748'
              }}
            />
            {searchOpen && searchResults.length > 0 && (
              <div style={{ marginTop: '8px', background: '#f7f9fc', borderRadius: '8px', overflow: 'hidden' }}>
                {searchResults.map((item, index) => (
                  <div key={index} onClick={() => { handleResultClick(item.url); setMenuOpen(false); }}
                    style={{ padding: '10px 12px', cursor: 'pointer', borderBottom: index < searchResults.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                    <span style={{ fontSize: '13px' }}>{ikonPerType[item.type]} {item.judul}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link to="/" style={mobileLinkStyle('/')} onClick={() => setMenuOpen(false)}>Beranda</Link>
          <div style={{ padding: '12px 16px', fontWeight: 600, color: '#718096', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tentang</div>
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
          <Link to="/admin/login" style={{ ...mobileLinkStyle('/admin/login'), borderTop: '1px solid #e2e8f0', marginTop: '8px', paddingTop: '16px' }} onClick={() => setMenuOpen(false)}>
            🔒 Login Admin
          </Link>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        input::placeholder { color: rgba(255,255,255,0.6); }
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
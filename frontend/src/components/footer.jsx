function Footer() {
  const tahun = new Date().getFullYear();

  return (
    <footer style={{
      background: '#0f2540',
      color: 'rgba(255,255,255,0.7)',
      marginTop: 'auto'
    }}>
      {/* Main Footer */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px 32px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '32px',
          marginBottom: '40px'
        }}>
          {/* Kolom 1 — Info */}
          <div>
            <div style={{ fontWeight: 700, color: 'white', marginBottom: '12px', fontSize: '16px' }}>
              Tracer Study Kimia
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', lineHeight: 1.8, margin: 0 }}>
              Program Studi Kimia<br />
              Fakultas Sains dan Teknologi<br />
              UIN Ar-Raniry Banda Aceh
            </p>
          </div>

          {/* Kolom 2 — Menu */}
          <div>
            <div style={{ fontWeight: 600, color: 'white', marginBottom: '12px', fontSize: '14px' }}>
              Menu
            </div>
            {[
              { label: 'Beranda', href: '/' },
              { label: 'Tracer Study', href: '/tracer-study' },
              { label: 'Profil Alumni', href: '/profil-alumni' },
              { label: 'Informasi', href: '/informasi' },
              { label: 'FAQ', href: '/faq' },
              { label: 'Laporan & Saran', href: '/laporan-saran' },
            ].map((item) => (
              <div key={item.label} style={{ marginBottom: '8px' }}>
                <a href={item.href} style={{
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '13px',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                >
                  {item.label}
                </a>
              </div>
            ))}
          </div>

          {/* Kolom 3 — Tentang */}
          <div>
            <div style={{ fontWeight: 600, color: 'white', marginBottom: '12px', fontSize: '14px' }}>
              Tentang
            </div>
            {[
              { label: 'Struktur Organisasi', href: '/tentang/struktur_organisasi' },
              { label: 'Surveyor', href: '/tentang/surveyor' },
              { label: 'Peneliti', href: '/tentang/peneliti' },
            ].map((item) => (
              <div key={item.label} style={{ marginBottom: '8px' }}>
                <a href={item.href} style={{
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '13px',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                >
                  {item.label}
                </a>
              </div>
            ))}
          </div>

          {/* Kolom 4 — Kontak & Sosmed */}
          <div>
            <div style={{ fontWeight: 600, color: 'white', marginBottom: '12px', fontSize: '14px' }}>
              Kontak
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', lineHeight: 1.9, margin: '0 0 16px' }}>
              📍 Jl. Syeikh Abdur Rauf<br />
              Banda Aceh, Aceh<br />
              📧 kimia@ar-raniry.ac.id
            </p>

            {/* Instagram */}
            <div style={{ fontWeight: 600, color: 'white', marginBottom: '10px', fontSize: '14px' }}>
              Ikuti Kami
            </div>
            <a
              href="https://www.instagram.com/kimia.uinar"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)',
                color: 'white',
                padding: '8px 14px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: 500,
                transition: 'opacity 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              @kimia.uinar
            </a>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
              © {tahun} Tracer Study Kimia UIN Ar-Raniry. All rights reserved.
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
              Developed by <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>Tim Magang Kimia UINAR</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
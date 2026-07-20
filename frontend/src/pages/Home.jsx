function Home() {
  return (
    <div>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #1a3a5c 0%, #0f2540 100%)',
        color: 'white',
        padding: '80px 24px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(46, 204, 113, 0.2)',
            border: '1px solid rgba(46, 204, 113, 0.4)',
            borderRadius: '20px',
            padding: '6px 16px',
            fontSize: '13px',
            color: '#2ecc71',
            fontWeight: 600,
            marginBottom: '20px',
            letterSpacing: '0.5px'
          }}>
            Program Studi Kimia
          </div>

          <h1 style={{ color: 'white', fontSize: '2.6rem', marginBottom: '16px', lineHeight: 1.3 }}>
            Tracer Study Kimia UINAR
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: '16px' }}>
            Fakultas Sains dan Teknologi - Universitas Islam Negeri Ar-Raniry
          </p>

          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '17px', marginBottom: '36px', lineHeight: 1.7 }}>
            Website ini digunakan untuk melacak jejak alumni dan lulusan Program Studi Kimia
            UIN Ar-Raniry Banda Aceh.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/tracer-study" className="btn-primary" style={{ fontSize: '15px', padding: '12px 28px' }}>
              Isi Kuisioner
            </a>
            <a href="/informasi" className="btn-secondary" style={{
              fontSize: '15px', padding: '12px 28px',
              background: 'transparent', color: 'white', borderColor: 'rgba(255,255,255,0.5)'
            }}>
              Lihat Informasi
            </a>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', textAlign: 'center' }}>
            {[
              { angka: '500+', label: 'Alumni Terdaftar' },
              { angka: '3', label: 'Jenis Tracer Study' },
              { angka: '85%', label: 'Tingkat Partisipasi' },
              { angka: '2024', label: 'Tahun Terakhir Survey' },
            ].map((stat) => (
              <div key={stat.label}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1a3a5c', marginBottom: '4px' }}>{stat.angka}</div>
                <div style={{ fontSize: '14px', color: '#718096' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fitur Section */}
      <div className="page-content">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Apa yang bisa kamu lakukan?</h2>
          <p>Temukan berbagai fitur yang tersedia di website Tracer Study Kimia UINAR</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          {[
            { icon: '📋', title: 'Isi Kuisioner', desc: 'Isi kuisioner tracer study sesuai dengan kategori kamu — alumni, mahasiswa, atau pengguna lulusan.', link: '/tracer-study' },
            { icon: '📊', title: 'Lihat Hasil Survey', desc: 'Lihat rekap statistik hasil tracer study yang sudah dilakukan secara berkala.', link: '/tracer-study' },
            { icon: '📰', title: 'Informasi', desc: 'Baca artikel dan informasi terbaru seputar kegiatan tracer study dan program studi Kimia.', link: '/informasi' },
            { icon: '👥', title: 'Profil Alumni', desc: 'Kenali alumni-alumni inspiratif dari Program Studi Kimia UIN Ar-Raniry.', link: '/profil-alumni' },
          ].map((fitur) => (
            <a key={fitur.title} href={fitur.link} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ textAlign: 'center', cursor: 'pointer', height: '100%' }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>{fitur.icon}</div>
                <h3 style={{ marginBottom: '8px', color: '#1a3a5c' }}>{fitur.title}</h3>
                <p style={{ fontSize: '14px' }}>{fitur.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div style={{
        background: 'linear-gradient(135deg, #1a3a5c 0%, #0f2540 100%)',
        color: 'white',
        padding: '60px 24px',
        textAlign: 'center',
        marginTop: '40px'
      }}>
        <h2 style={{ color: 'white', fontSize: '1.8rem', marginBottom: '12px' }}>
          Sudah lulus? Isi tracer study sekarang!
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '28px' }}>
          Partisipasi kamu sangat membantu pengembangan Program Studi Kimia ke depannya.
        </p>
        <a href="/tracer-study" className="btn-primary" style={{
          background: '#2ecc71', fontSize: '15px', padding: '12px 32px'
        }}>
          Mulai Isi Kuisioner →
        </a>
      </div>

      {/* Footer */}
      <footer style={{
        background: '#0f2540',
        color: 'rgba(255,255,255,0.7)',
        padding: '40px 24px',
        marginTop: 'auto'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px' }}>
          <div>
            <div style={{ fontWeight: 700, color: 'white', marginBottom: '12px', fontSize: '16px' }}>Tracer Study Kimia</div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', lineHeight: 1.7 }}>
              Program Studi Kimia<br />
              Fakultas Sains dan Teknologi<br />
              UIN Ar-Raniry Banda Aceh
            </p>
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'white', marginBottom: '12px' }}>Menu</div>
            {[
              { label: 'Beranda', href: '/' },
              { label: 'Tracer Study', href: '/tracer-study' },
              { label: 'Informasi', href: '/informasi' },
              { label: 'Profil Alumni', href: '/profil-alumni' },
              { label: 'FAQ', href: '/faq' },
            ].map((item) => (
              <div key={item.label} style={{ marginBottom: '6px' }}>
                <a href={item.href} style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', textDecoration: 'none' }}>{item.label}</a>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'white', marginBottom: '12px' }}>Kontak</div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', lineHeight: 1.9 }}>
              📍 Jl. Syeikh Abdur Rauf<br />
              Banda Aceh, Aceh<br />
              📧 kimia@ar-raniry.ac.id
            </p>
          </div>
        </div>
        <div style={{
          maxWidth: '1100px', margin: '32px auto 0',
          paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)',
          textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.4)'
        }}>
          © 2026 Tracer Study Kimia UIN Ar-Raniry. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Home;
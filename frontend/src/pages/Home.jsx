import { useState, useEffect } from 'react';

function Home() {
  const [stats, setStats] = useState({
    alumni_terdaftar: 0,
    jenis_tracer: 0,
    periode_terakhir: '-',
    partisipasi_per_jenis: [],
  });

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetch(`${BASE_URL}/stats`)
      .then(res => res.json())
      .then(result => {
        if (result.success) setStats(result);
      })
      .catch(() => {});
  }, []);

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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', textAlign: 'center', marginBottom: '32px' }}>
            {[
              { angka: `${stats.alumni_terdaftar}+`, label: 'Alumni Terdaftar' },
              { angka: stats.jenis_tracer, label: 'Jenis Tracer Study' },
              { angka: stats.periode_terakhir, label: 'Periode Survey Terakhir' },
            ].map((stat) => (
              <div key={stat.label}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1a3a5c', marginBottom: '4px' }}>{stat.angka}</div>
                <div style={{ fontSize: '14px', color: '#718096' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '28px' }}>
            <div style={{ textAlign: 'center', fontSize: '13px', color: '#718096', marginBottom: '20px', fontWeight: 600 }}>
              TINGKAT PARTISIPASI PER JENIS TRACER
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
              {stats.partisipasi_per_jenis.map((item) => (
                <div key={item.jenis} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '14px', color: '#4a5568', fontWeight: 600, marginBottom: '10px' }}>{item.label}</div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    {item.periode_data.map((pd) => (
                      <div key={pd.periode}>
                        <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#2ecc71' }}>{pd.persen}%</div>
                        <div style={{ fontSize: '12px', color: '#718096' }}>{pd.periode}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
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
    </div>
  );
}

export default Home;
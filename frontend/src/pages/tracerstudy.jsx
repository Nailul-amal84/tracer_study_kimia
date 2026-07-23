import { useState, useEffect } from 'react';
import Spinner from '../components/Spinner';

function TracerStudy() {
  const [tracers, setTracers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [aktifJenis, setAktifJenis] = useState(null);
  const [hasil, setHasil] = useState(null);
  const [loadingHasil, setLoadingHasil] = useState(false);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchTracers = async () => {
      try {
        const res = await fetch(`${BASE_URL}/tracer-study`);
        const result = await res.json();
        if (result.success) setTracers(result.data);
      } catch (err) {
        setError('Gagal mengambil data tracer study');
      } finally {
        setLoading(false);
      }
    };
    fetchTracers();
  }, []);

  const fetchHasil = async (jenis) => {
    setLoadingHasil(true);
    setHasil(null);
    setAktifJenis(jenis);
    try {
      const res = await fetch(`${BASE_URL}/tracer-study/${jenis}/hasil`);
      const result = await res.json();
      if (result.success) setHasil(result);
    } catch (err) {
      setError('Gagal mengambil hasil survey');
    } finally {
      setLoadingHasil(false);
    }
  };

  const ikonPerJenis = {
    pengguna_lulusan: '🏢',
    mahasiswa: '🎓',
    alumni: '👨‍🎓',
  };

  return (
    <div>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a3a5c 0%, #0f2540 100%)',
        padding: '48px 24px',
        textAlign: 'center',
        color: 'white'
      }}>
        <h1 style={{ color: 'white', marginBottom: '8px' }}>Tracer Study</h1>
        <p style={{ color: 'rgba(255,255,255,0.75)' }}>
          Pilih jenis tracer study untuk mengisi kuisioner atau melihat hasil survey
        </p>
      </div>

      {/* Content */}
      <div className="page-content">
        {error && <div className="alert-error">{error}</div>}

        {loading ? (
          <Spinner />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
          }}>
            {tracers.map((tracer) => (
              <div
                key={tracer.id}
                className="card"
                style={{
                  textAlign: 'center',
                  outline: aktifJenis === tracer.jenis ? '2px solid #1a3a5c' : 'none',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.2s ease',
                  height: '100%'
                }}
              >
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>
                  {ikonPerJenis[tracer.jenis] || '📋'}
                </div>
                <h2 style={{ fontSize: '17px', marginBottom: '8px' }}>{tracer.label}</h2>
                <p style={{ fontSize: '13px', color: '#718096', marginBottom: '20px' }}>
                  {tracer.jenis === 'pengguna_lulusan' && 'Untuk perusahaan/instansi pengguna lulusan Kimia UINAR'}
                  {tracer.jenis === 'mahasiswa' && 'Untuk mahasiswa aktif Program Studi Kimia UINAR'}
                  {tracer.jenis === 'alumni' && 'Untuk alumni dan lulusan Program Studi Kimia UINAR'}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {tracer.google_form_url ? (
                    <a
                      href={tracer.google_form_url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-primary"
                      style={{ 
                        width: '100%', 
                        boxSizing: 'border-box',
                        padding: '10px 24px',
                        fontSize: '15px',
                        lineHeight: '1.5',
                        display: 'block'
                      }}
                    >
                      📝 Isi Kuisioner
                    </a>
                  ) : (
                    <div style={{
                      padding: '10px 16px',
                      background: '#f7f9fc',
                      color: '#a0aec0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      border: '1px dashed #e2e8f0'
                    }}>
                      Link belum tersedia
                    </div>
                  )}

                  <button
                    onClick={() => fetchHasil(tracer.jenis)}
                    className="btn-secondary"
                    style={{ 
                      width: '100%', 
                      boxSizing: 'border-box',
                      padding: '10px 24px',
                      fontSize: '15px',
                      lineHeight: '1.5'
                    }}
                  >
                    📊 Lihat Hasil Survey
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Hasil Survey */}
        {aktifJenis && (
          <div style={{
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '28px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <h2 style={{ fontSize: '20px', marginBottom: '20px', color: '#1a3a5c' }}>
              📊 Hasil Survey — {tracers.find(t => t.jenis === aktifJenis)?.label}
            </h2>

            {loadingHasil ? (
              <p>Memuat hasil survey...</p>
            ) : hasil && hasil.data ? (
              <div>
                <p style={{ fontSize: '13px', color: '#718096', marginBottom: '20px' }}>
                  Terakhir diperbarui: {new Date(hasil.terakhir_update).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                  gap: '16px'
                }}>
                  {Object.entries(hasil.data).map(([key, value]) => (
                    <div key={key} style={{
                      background: '#f7f9fc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '20px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '28px', fontWeight: 700, color: '#1a3a5c', marginBottom: '6px' }}>
                        {value}
                      </div>
                      <div style={{ fontSize: '12px', color: '#718096', textTransform: 'capitalize' }}>
                        {key.replace(/_/g, ' ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#718096' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
                <p>Belum ada data hasil survey untuk jenis tracer ini.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TracerStudy;
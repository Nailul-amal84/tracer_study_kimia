import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import Breadcrumb from '../components/breadcrumb';

function TracerStudy() {
  const [tracers, setTracers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

      <Breadcrumb items={[
        { label: 'Beranda', url: '/' },
        { label: 'Tracer Study' },
      ]} />

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
                  outline:'none',
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
                    onClick={() => navigate(`/tracer-study/${tracer.jenis}/hasil`)}
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
      </div>
    </div>
  );
}

export default TracerStudy;
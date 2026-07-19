import { useState, useEffect } from 'react';

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

  return (
    <div style={{ padding: '32px', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Tracer Study</h1>
      <p style={{ color: '#6b7280', marginBottom: '32px' }}>
        Pilih jenis tracer study di bawah untuk mengisi kuisioner atau melihat hasil survey.
      </p>

      {error && <div style={{ color: '#dc2626', marginBottom: '16px' }}>{error}</div>}

      {loading ? (
        <p>Memuat data...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {tracers.map((tracer) => (
            <div
              key={tracer.id}
              style={{
                border: `2px solid ${aktifJenis === tracer.jenis ? '#16213e' : '#ccc'}`,
                borderRadius: '8px',
                padding: '24px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📋</div>
              <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>{tracer.label}</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {tracer.google_form_url ? (
                  <a
                    href={tracer.google_form_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: 'block', padding: '8px 16px', background: '#16213e', color: 'white', borderRadius: '4px', textDecoration: 'none' }}
                  >
                    Isi Kuisioner
                  </a>
                ) : (
                  <div style={{ padding: '8px 16px', background: '#e5e7eb', color: '#6b7280', borderRadius: '4px', fontSize: '14px' }}>
                    Link belum tersedia
                  </div>
                )}

                <button
                  onClick={() => fetchHasil(tracer.jenis)}
                  style={{ padding: '8px 16px', background: '#f3f4f6', color: '#16213e', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Lihat Hasil Survey
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hasil Survey */}
      {aktifJenis && (
        <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>
            Hasil Survey — {tracers.find(t => t.jenis === aktifJenis)?.label}
          </h2>

          {loadingHasil ? (
            <p>Memuat hasil survey...</p>
          ) : hasil && hasil.data ? (
            <div>
              <p style={{ color: '#6b7280', marginBottom: '16px' }}>
                Terakhir diperbarui: {new Date(hasil.terakhir_update).toLocaleDateString('id-ID')}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                {Object.entries(hasil.data).map(([key, value]) => (
                  <div key={key} style={{ background: '#f3f4f6', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16213e' }}>{value}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                      {key.replace(/_/g, ' ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p style={{ color: '#6b7280' }}>Belum ada data hasil survey.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default TracerStudy;
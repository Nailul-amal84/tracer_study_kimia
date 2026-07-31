import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';

function Informasi() {
  const navigate = useNavigate();
  const [artikels, setArtikels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchArtikels = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/informasi?page=${page}`);
      const result = await res.json();
      if (result.success) {
        setArtikels(result.data.data || result.data);
        setTotalPage(result.data.last_page || 1);
      }
    } catch (err) {
      setError('Gagal mengambil data artikel');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtikels();
  }, [page]);

  return (
    <div>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a3a5c 0%, #0f2540 100%)',
        padding: '48px 24px',
        textAlign: 'center',
        color: 'white'
      }}>
        <h1 style={{ color: 'white', marginBottom: '8px' }}>Informasi</h1>
        <p style={{ color: 'rgba(255,255,255,0.75)' }}>
          Artikel dan informasi terbaru seputar Tracer Study Kimia UINAR
        </p>
      </div>

      {/* Content */}
      <div className="page-content" style={{ maxWidth: '860px' }}>
        {error && <div className="alert-error">{error}</div>}

        {loading ? (
          <Spinner />
        ) : artikels.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#718096' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📰</div>
            <p>Belum ada artikel.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {artikels.map((artikel) => (
              <div
                key={artikel.id}
                onClick={() => navigate(`/informasi/${artikel.id}`)}
                className="card"
                style={{
                  cursor: 'pointer',
                  padding: 0,
                  overflow: 'hidden',
                  display: 'grid',
                  gridTemplateColumns: artikel.cover_artikel ? 'auto 1fr' : '1fr',
                  transition: 'box-shadow 0.2s ease, transform 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                }}
              >
                {artikel.cover_artikel && (
                  <div style={{
                    width: '200px',
                    minWidth: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#f7f9fc',
                    borderRadius: '4px',
                    padding: '8px'
                  }}> 
                    <img
                      src={`http://127.0.0.1:8000/storage/${artikel.cover_artikel}`}
                      alt={artikel.judul}
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        borderRadius: '4px'
                      }}
                    />
                  </div>
                )}
                <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{
                    fontSize: '12px',
                    color: '#2b6cb0',
                    fontWeight: 600,
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {new Date(artikel.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <h2 style={{ fontSize: '18px', marginBottom: '8px', color: '#1a3a5c', lineHeight: 1.4 }}>
                    {artikel.judul}
                  </h2>
                  <p style={{ fontSize: '14px', color: '#718096', lineHeight: 1.6, marginBottom: '16px' }}>
                    {artikel.ringkasan}
                  </p>
                  <span style={{ color: '#1a3a5c', fontSize: '14px', fontWeight: 600 }}>
                    Baca selengkapnya →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPage > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '32px' }}>
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="btn-secondary"
              style={{ opacity: page === 1 ? 0.5 : 1, cursor: page === 1 ? 'not-allowed' : 'pointer' }}
            >
              ← Sebelumnya
            </button>
            <span style={{ padding: '10px 16px', color: '#718096', fontSize: '14px' }}>
              {page} / {totalPage}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPage}
              className="btn-secondary"
              style={{ opacity: page === totalPage ? 0.5 : 1, cursor: page === totalPage ? 'not-allowed' : 'pointer' }}
            >
              Selanjutnya →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Informasi;
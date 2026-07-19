import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Informasi</h1>

      {error && <div style={{ color: '#dc2626' }}>{error}</div>}

      {loading ? (
        <p>Memuat data...</p>
      ) : artikels.length === 0 ? (
        <p>Belum ada artikel.</p>
      ) : (
        artikels.map((artikel) => (
          <div
            key={artikel.id}
            onClick={() => navigate(`/informasi/${artikel.id}`)}
            style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', marginBottom: '16px', cursor: 'pointer' }}
          >
            {artikel.cover_artikel && (
              <img
                src={`http://127.0.0.1:8000/storage/${artikel.cover_artikel}`}
                alt={artikel.judul}
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px', marginBottom: '12px' }}
              />
            )}
            <h2 style={{ margin: '0 0 8px', fontSize: '20px' }}>{artikel.judul}</h2>
            <p style={{ color: '#6b7280', marginBottom: '8px' }}>{artikel.ringkasan}</p>
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>
              {new Date(artikel.created_at).toLocaleDateString('id-ID')}
            </div>
          </div>
        ))
      )}

      {/* Pagination */}
      {totalPage > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            style={{ padding: '8px 16px', border: '1px solid #ccc', borderRadius: '4px', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
          >
            ← Sebelumnya
          </button>
          <span style={{ padding: '8px 16px' }}>{page} / {totalPage}</span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPage}
            style={{ padding: '8px 16px', border: '1px solid #ccc', borderRadius: '4px', cursor: page === totalPage ? 'not-allowed' : 'pointer' }}
          >
            Selanjutnya →
          </button>
        </div>
      )}
    </div>
  );
}

export default Informasi;
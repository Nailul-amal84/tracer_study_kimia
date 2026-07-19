import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function DetailArtikel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artikel, setArtikel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchArtikel = async () => {
      try {
        const res = await fetch(`${BASE_URL}/informasi/${id}`);
        const result = await res.json();
        if (result.success) setArtikel(result.data);
        else setError('Artikel tidak ditemukan');
      } catch (err) {
        setError('Gagal mengambil data artikel');
      } finally {
        setLoading(false);
      }
    };
    fetchArtikel();
  }, [id]);

  if (loading) return <div style={{ padding: '32px' }}>Memuat data...</div>;
  if (error) return <div style={{ padding: '32px', color: '#dc2626' }}>{error}</div>;

  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <button
        onClick={() => navigate('/informasi')}
        style={{ padding: '8px 16px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '24px' }}
      >
        ← Kembali
      </button>

      {artikel.cover_artikel && (
        <img
          src={`http://127.0.0.1:8000/storage/${artikel.cover_artikel}`}
          alt={artikel.judul}
          style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '8px', marginBottom: '24px' }}
        />
      )}

      <h1 style={{ marginBottom: '8px' }}>{artikel.judul}</h1>
      <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '24px' }}>
        {new Date(artikel.created_at).toLocaleDateString('id-ID')}
      </div>

      <p style={{ color: '#6b7280', marginBottom: '24px', fontStyle: 'italic' }}>{artikel.ringkasan}</p>

      <div style={{ lineHeight: '1.8', marginBottom: '32px' }}>{artikel.isi}</div>

      {artikel.file_url && (
        <a
          href={`http://127.0.0.1:8000/storage/${artikel.file_url}`}
          target="_blank"
          rel="noreferrer"
          style={{ display: 'inline-block', padding: '10px 24px', background: '#16213e', color: 'white', borderRadius: '4px', textDecoration: 'none' }}
        >
          📄 Unduh File
        </a>
      )}
    </div>
  );
}

export default DetailArtikel;
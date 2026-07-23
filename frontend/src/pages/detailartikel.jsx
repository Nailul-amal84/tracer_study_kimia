import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';

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

  if (loading) {
    return <Spinner />;
  }

  if (error) return (
    <div style={{ padding: '80px 24px', textAlign: 'center' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>😕</div>
      <p style={{ color: '#718096' }}>{error}</p>
      <button onClick={() => navigate('/informasi')} className="btn-primary" style={{ marginTop: '16px' }}>
        ← Kembali ke Informasi
      </button>
    </div>
  );

  return (
    <div>
      {/* Cover Image */}
      {artikel.cover_artikel && (
        <div style={{ width: '100%', height: '380px', overflow: 'hidden' }}>
          <img
            src={`http://127.0.0.1:8000/storage/${artikel.cover_artikel}`}
            alt={artikel.judul}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}

      {/* Content */}
      <div className="page-content" style={{ maxWidth: '780px' }}>
        {/* Tombol Kembali */}
        <button
          onClick={() => navigate('/informasi')}
          className="btn-gray"
          style={{ marginBottom: '24px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          ← Kembali ke Informasi
        </button>

        {/* Tanggal */}
        <div style={{
          fontSize: '13px',
          color: '#2b6cb0',
          fontWeight: 600,
          marginBottom: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {new Date(artikel.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>

        {/* Judul */}
        <h1 style={{ fontSize: '2rem', marginBottom: '12px', lineHeight: 1.3 }}>
          {artikel.judul}
        </h1>

        {/* Ringkasan */}
        <p style={{
          color: '#4a5568',
          fontSize: '17px',
          fontStyle: 'italic',
          marginBottom: '28px',
          paddingBottom: '28px',
          borderBottom: '1px solid #e2e8f0',
          lineHeight: 1.7
        }}>
          {artikel.ringkasan}
        </p>

        {/* Isi Artikel */}
        <div style={{
          lineHeight: 1.85,
          fontSize: '16px',
          color: '#2d3748',
          marginBottom: '40px'
        }}>
          {artikel.isi}
        </div>

        {/* Tombol Unduh */}
        {artikel.file_url && (
          <div style={{
            background: '#f7f9fc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <div style={{ fontWeight: 600, color: '#1a3a5c', marginBottom: '4px' }}>File Terlampir</div>
              <div style={{ fontSize: '13px', color: '#718096' }}>Klik tombol untuk mengunduh file dokumen</div>
            </div>
            <a
              href={`http://127.0.0.1:8000/storage/${artikel.file_url}`}
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              📄 Unduh File
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default DetailArtikel;
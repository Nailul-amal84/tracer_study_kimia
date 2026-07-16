import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LihatPesan() {
  const navigate = useNavigate();
  const [pesans, setPesans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('token');
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchPesan = async () => {
    try {
      const res = await fetch(`${BASE_URL}/laporan-saran`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) setPesans(result.data.data || result.data);
    } catch (err) {
      setError('Gagal mengambil data pesan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) { navigate('/admin/login'); return; }
    fetchPesan();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Yakin mau hapus pesan ini?')) return;

    try {
      const res = await fetch(`${BASE_URL}/laporan-saran/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const result = await res.json();
      if (result.success) {
        setSuccess(result.message);
        fetchPesan();
      }
    } catch (err) {
      setError('Gagal menghapus pesan');
    }
  };

  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>Pesan Masuk</h1>
        <button onClick={() => navigate('/admin/dashboard')}
          style={{ padding: '8px 16px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          ← Kembali
        </button>
      </div>

      {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '4px', marginBottom: '16px' }}>{error}</div>}
      {success && <div style={{ background: '#dcfce7', color: '#16a34a', padding: '10px', borderRadius: '4px', marginBottom: '16px' }}>{success}</div>}

      {loading ? <p>Memuat data...</p> : pesans.length === 0 ? <p>Belum ada pesan masuk.</p> : (
        pesans.map((pesan) => (
          <div key={pesan.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', marginBottom: '12px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{pesan.nama}</div>
            <div style={{ color: '#6b7280', marginBottom: '4px' }}>{pesan.email}</div>
            <div style={{ marginBottom: '12px' }}>{pesan.pesan}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>{new Date(pesan.created_at).toLocaleDateString('id-ID')}</div>
              <button onClick={() => handleDelete(pesan.id)}
                style={{ padding: '4px 12px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Hapus
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default LihatPesan;
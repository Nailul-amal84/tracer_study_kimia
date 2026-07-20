import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';

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
      if (result.success) { setSuccess(result.message); fetchPesan(); }
    } catch (err) { setError('Gagal menghapus pesan'); }
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.6rem' }}>Pesan Masuk</h1>
        <span style={{
          background: '#ebf8ff',
          color: '#2b6cb0',
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '13px',
          fontWeight: 600
        }}>
          {pesans.length} pesan
        </span>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {success && <div className="alert-success">{success}</div>}

      {loading ? <p>Memuat data...</p> : pesans.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#718096' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
          <p>Belum ada pesan masuk.</p>
        </div>
      ) : (
        pesans.map((pesan) => (
          <div key={pesan.id} className="card" style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <div style={{
                    width: '36px', height: '36px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1a3a5c, #2d5986)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 700, fontSize: '14px', flexShrink: 0
                  }}>
                    {pesan.nama.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#1a3a5c', fontSize: '14px' }}>{pesan.nama}</div>
                    <div style={{ fontSize: '12px', color: '#718096' }}>{pesan.email}</div>
                  </div>
                </div>
                <div style={{
                  background: '#f7f9fc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '12px',
                  fontSize: '14px',
                  color: '#2d3748',
                  lineHeight: 1.6,
                  marginBottom: '8px'
                }}>
                  {pesan.pesan}
                </div>
                <div style={{ fontSize: '12px', color: '#a0aec0' }}>
                  {new Date(pesan.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
              <button
                onClick={() => handleDelete(pesan.id)}
                className="btn-danger"
                style={{ flexShrink: 0 }}
              >
                Hapus
              </button>
            </div>
          </div>
        ))
      )}
    </AdminLayout>
  );
}

export default LihatPesan;
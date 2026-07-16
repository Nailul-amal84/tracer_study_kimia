import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function KelolaTracerStudy() {
  const navigate = useNavigate();
  const [tracers, setTracers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editJenis, setEditJenis] = useState(null);
  const [formUrl, setFormUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('token');
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

  useEffect(() => {
    if (!token) { navigate('/admin/login'); return; }
    fetchTracers();
  }, []);

  const handleEdit = (tracer) => {
    setEditJenis(tracer.jenis);
    setFormUrl(tracer.google_form_url || '');
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${BASE_URL}/tracer-study/${editJenis}/link`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ google_form_url: formUrl })
      });

      const result = await res.json();

      if (result.success) {
        setSuccess(result.message);
        setEditJenis(null);
        setFormUrl('');
        fetchTracers();
      } else {
        setError(result.message || 'Terjadi kesalahan');
      }
    } catch (err) {
      setError('Gagal terhubung ke server');
    }
  };

  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>Kelola Tracer Study</h1>
        <button onClick={() => navigate('/admin/dashboard')}
          style={{ padding: '8px 16px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          ← Kembali
        </button>
      </div>

      {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '4px', marginBottom: '16px' }}>{error}</div>}
      {success && <div style={{ background: '#dcfce7', color: '#16a34a', padding: '10px', borderRadius: '4px', marginBottom: '16px' }}>{success}</div>}

      {editJenis && (
        <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '24px', marginBottom: '32px' }}>
          <h2 style={{ margin: '0 0 16px', fontSize: '18px' }}>Update Link Google Form</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label>Link Google Form</label>
              <input type="url" value={formUrl} onChange={(e) => setFormUrl(e.target.value)} required
                placeholder="https://forms.gle/..."
                style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit"
                style={{ padding: '8px 24px', background: '#16213e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Simpan Link
              </button>
              <button type="button" onClick={() => { setEditJenis(null); setFormUrl(''); }}
                style={{ padding: '8px 24px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Daftar Jenis Tracer Study</h2>
      {loading ? <p>Memuat data...</p> : (
        tracers.map((tracer) => (
          <div key={tracer.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', marginBottom: '12px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{tracer.label}</div>
            <div style={{ color: '#6b7280', marginBottom: '4px' }}>
              Link Form: {tracer.google_form_url
                ? <a href={tracer.google_form_url} target="_blank" rel="noreferrer">{tracer.google_form_url}</a>
                : <span style={{ color: '#dc2626' }}>Belum ada link</span>}
            </div>
            <div style={{ marginTop: '12px' }}>
              <button onClick={() => handleEdit(tracer)}
                style={{ padding: '4px 12px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Update Link
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default KelolaTracerStudy;
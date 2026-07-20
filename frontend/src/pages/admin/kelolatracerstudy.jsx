import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';

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
    setError(''); setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      const res = await fetch(`${BASE_URL}/tracer-study/${editJenis}/link`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ google_form_url: formUrl })
      });
      const result = await res.json();
      if (result.success) {
        setSuccess(result.message);
        setEditJenis(null); setFormUrl('');
        fetchTracers();
      } else setError(result.message || 'Terjadi kesalahan');
    } catch (err) { setError('Gagal terhubung ke server'); }
  };

  const ikonPerJenis = {
    pengguna_lulusan: '🏢',
    mahasiswa: '🎓',
    alumni: '👨‍🎓',
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.6rem' }}>Kelola Tracer Study</h1>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {success && <div className="alert-success">{success}</div>}

      {/* Form Update Link */}
      {editJenis && (
        <div className="card" style={{ marginBottom: '28px', borderLeft: '4px solid #1a3a5c' }}>
          <h2 style={{ fontSize: '16px', marginBottom: '16px' }}>
            Update Link Google Form — {tracers.find(t => t.jenis === editJenis)?.label}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Link Google Form</label>
              <input
                type="url"
                value={formUrl}
                onChange={(e) => setFormUrl(e.target.value)}
                required
                placeholder="https://forms.gle/..."
              />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" className="btn-primary">Simpan Link</button>
              <button type="button" onClick={() => { setEditJenis(null); setFormUrl(''); }} className="btn-gray">Batal</button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <h2 style={{ fontSize: '16px', marginBottom: '16px' }}>Daftar Jenis Tracer Study</h2>
      {loading ? <p>Memuat data...</p> : (
        tracers.map((tracer) => (
          <div key={tracer.id} className="card" style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '20px' }}>{ikonPerJenis[tracer.jenis] || '📋'}</span>
                  <span style={{ fontWeight: 600, color: '#1a3a5c', fontSize: '15px' }}>{tracer.label}</span>
                </div>
                <div style={{ fontSize: '13px', color: '#718096' }}>
                  Link Form:{' '}
                  {tracer.google_form_url ? (
                    <a href={tracer.google_form_url} target="_blank" rel="noreferrer" style={{ color: '#2b6cb0', wordBreak: 'break-all' }}>
                      {tracer.google_form_url}
                    </a>
                  ) : (
                    <span style={{ color: '#e53e3e', fontWeight: 500 }}>⚠️ Belum ada link</span>
                  )}
                </div>
              </div>
              <button onClick={() => handleEdit(tracer)} className="btn-warning" style={{ flexShrink: 0 }}>
                Update Link
              </button>
            </div>
          </div>
        ))
      )}
    </AdminLayout>
  );
}

export default KelolaTracerStudy;
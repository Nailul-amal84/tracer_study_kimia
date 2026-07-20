import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';

function KelolaArtikel() {
  const navigate = useNavigate();
  const [artikels, setArtikels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ judul: '', ringkasan: '', isi: '' });
  const [coverFile, setCoverFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('token');
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchArtikels = async () => {
    try {
      const res = await fetch(`${BASE_URL}/informasi`);
      const result = await res.json();
      if (result.success) setArtikels(result.data.data || result.data);
    } catch (err) {
      setError('Gagal mengambil data artikel');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) { navigate('/admin/login'); return; }
    fetchArtikels();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    const formData = new FormData();
    formData.append('judul', form.judul);
    formData.append('ringkasan', form.ringkasan);
    formData.append('isi', form.isi);
    if (coverFile) formData.append('cover_artikel', coverFile);
    if (pdfFile) formData.append('file_url', pdfFile);
    if (editId) formData.append('_method', 'PUT');
    const url = editId ? `${BASE_URL}/informasi/${editId}` : `${BASE_URL}/informasi`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const result = await res.json();
      if (result.success) {
        setSuccess(result.message);
        setForm({ judul: '', ringkasan: '', isi: '' });
        setCoverFile(null); setPdfFile(null); setEditId(null);
        fetchArtikels();
      } else setError(result.message || 'Terjadi kesalahan');
    } catch (err) { setError('Gagal terhubung ke server'); }
  };

  const handleEdit = (artikel) => {
    setEditId(artikel.id);
    setForm({ judul: artikel.judul, ringkasan: artikel.ringkasan, isi: artikel.isi || '' });
    setError(''); setSuccess('');
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin mau hapus artikel ini?')) return;
    try {
      const res = await fetch(`${BASE_URL}/informasi/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) { setSuccess(result.message); fetchArtikels(); }
    } catch (err) { setError('Gagal menghapus artikel'); }
  };

  const handleCancel = () => {
    setEditId(null);
    setForm({ judul: '', ringkasan: '', isi: '' });
    setCoverFile(null); setPdfFile(null);
    setError(''); setSuccess('');
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.6rem' }}>Kelola Artikel</h1>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {success && <div className="alert-success">{success}</div>}

      {/* Form */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '16px', marginBottom: '16px' }}>{editId ? 'Edit Artikel' : 'Tambah Artikel Baru'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Judul</label>
            <input type="text" name="judul" value={form.judul} onChange={handleChange} required placeholder="Judul artikel..." />
          </div>
          <div className="form-group">
            <label>Ringkasan</label>
            <textarea name="ringkasan" value={form.ringkasan} onChange={handleChange} required rows={2} placeholder="Ringkasan singkat artikel..." />
          </div>
          <div className="form-group">
            <label>Isi Artikel</label>
            <textarea name="isi" value={form.isi} onChange={handleChange} required rows={6} placeholder="Isi lengkap artikel..." />
          </div>
          <div className="form-group">
            <label>Cover Artikel (jpg/png, maks 5MB)</label>
            <input type="file" accept="image/jpg,image/jpeg,image/png" onChange={(e) => setCoverFile(e.target.files[0])} />
          </div>
          <div className="form-group">
            <label>File PDF (maks 20MB)</label>
            <input type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files[0])} />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" className="btn-primary">{editId ? 'Simpan Perubahan' : 'Tambah Artikel'}</button>
            {editId && <button type="button" onClick={handleCancel} className="btn-gray">Batal</button>}
          </div>
        </form>
      </div>

      {/* List */}
      <h2 style={{ fontSize: '16px', marginBottom: '16px' }}>Daftar Artikel ({artikels.length})</h2>
      {loading ? <p>Memuat data...</p> : artikels.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>Belum ada artikel.</div>
      ) : (
        artikels.map((artikel) => (
          <div key={artikel.id} className="card" style={{ marginBottom: '12px', display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, color: '#1a3a5c', marginBottom: '4px' }}>{artikel.judul}</div>
              <div style={{ color: '#718096', fontSize: '13px' }}>{artikel.ringkasan}</div>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              <button onClick={() => handleEdit(artikel)} className="btn-warning">Edit</button>
              <button onClick={() => handleDelete(artikel.id)} className="btn-danger">Hapus</button>
            </div>
          </div>
        ))
      )}
    </AdminLayout>
  );
}

export default KelolaArtikel;
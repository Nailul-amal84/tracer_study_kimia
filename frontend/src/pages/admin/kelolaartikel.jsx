import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

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
        setCoverFile(null);
        setPdfFile(null);
        setEditId(null);
        fetchArtikels();
      } else {
        setError(result.message || 'Terjadi kesalahan');
      }
    } catch (err) {
      setError('Gagal terhubung ke server');
    }
  };

  const handleEdit = (artikel) => {
    setEditId(artikel.id);
    setForm({ judul: artikel.judul, ringkasan: artikel.ringkasan, isi: artikel.isi || '' });
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin mau hapus artikel ini?')) return;

    try {
      const res = await fetch(`${BASE_URL}/informasi/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const result = await res.json();
      if (result.success) {
        setSuccess(result.message);
        fetchArtikels();
      }
    } catch (err) {
      setError('Gagal menghapus artikel');
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setForm({ judul: '', ringkasan: '', isi: '' });
    setCoverFile(null);
    setPdfFile(null);
    setError('');
    setSuccess('');
  };

  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>Kelola Artikel</h1>
        <button
          onClick={() => navigate('/admin/dashboard')}
          style={{ padding: '8px 16px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          ← Kembali
        </button>
      </div>

      {/* Notifikasi */}
      {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '4px', marginBottom: '16px' }}>{error}</div>}
      {success && <div style={{ background: '#dcfce7', color: '#16a34a', padding: '10px', borderRadius: '4px', marginBottom: '16px' }}>{success}</div>}

      {/* Form Tambah/Edit */}
      <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '24px', marginBottom: '32px' }}>
        <h2 style={{ margin: '0 0 16px', fontSize: '18px' }}>{editId ? 'Edit Artikel' : 'Tambah Artikel Baru'}</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '12px' }}>
            <label>Judul</label>
            <input
              type="text"
              name="judul"
              value={form.judul}
              onChange={handleChange}
              required
              style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label>Ringkasan</label>
            <textarea
              name="ringkasan"
              value={form.ringkasan}
              onChange={handleChange}
              required
              rows={2}
              style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label>Isi Artikel</label>
            <textarea
              name="isi"
              value={form.isi}
              onChange={handleChange}
              required
              rows={6}
              style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label>Cover Artikel (jpg/png, maks 5MB)</label>
            <input
              type="file"
              accept="image/jpg,image/jpeg,image/png"
              onChange={(e) => setCoverFile(e.target.files[0])}
              style={{ display: 'block', marginTop: '4px' }}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label>File PDF (maks 20MB)</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdfFile(e.target.files[0])}
              style={{ display: 'block', marginTop: '4px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="submit"
              style={{ padding: '8px 24px', background: '#16213e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              {editId ? 'Simpan Perubahan' : 'Tambah Artikel'}
            </button>
            {editId && (
              <button
                type="button"
                onClick={handleCancel}
                style={{ padding: '8px 24px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List Artikel */}
      <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Daftar Artikel</h2>
      {loading ? (
        <p>Memuat data...</p>
      ) : artikels.length === 0 ? (
        <p>Belum ada artikel.</p>
      ) : (
        artikels.map((artikel) => (
          <div key={artikel.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', marginBottom: '12px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{artikel.judul}</div>
            <div style={{ color: '#6b7280', marginBottom: '12px' }}>{artikel.ringkasan}</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleEdit(artikel)}
                style={{ padding: '4px 12px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(artikel.id)}
                style={{ padding: '4px 12px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Hapus
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default KelolaArtikel;
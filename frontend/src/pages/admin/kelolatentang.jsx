import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';

function KelolaTentang() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ nama: '', jabatan: '', jenis: 'struktur_organisasi' });
  const [fotoFile, setFotoFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [filterJenis, setFilterJenis] = useState('struktur_organisasi');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('token');
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const jenisLabel = {
    struktur_organisasi: 'Struktur Organisasi',
    surveyor: 'Surveyor',
    peneliti: 'Peneliti'
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/tentang/${filterJenis}`);
      const result = await res.json();
      if (result.success) setData(result.data);
    } catch (err) {
      setError('Gagal mengambil data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) { navigate('/admin/login'); return; }
    fetchData();
  }, [filterJenis]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    const formData = new FormData();
    formData.append('nama', form.nama);
    formData.append('jabatan', form.jabatan);
    formData.append('jenis', form.jenis);
    if (fotoFile) formData.append('foto', fotoFile);
    if (editId) formData.append('_method', 'PUT');
    const url = editId ? `${BASE_URL}/tentang/${editId}` : `${BASE_URL}/tentang`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const result = await res.json();
      if (result.success) {
        setSuccess(result.message);
        setForm({ nama: '', jabatan: '', jenis: 'struktur_organisasi' });
        setFotoFile(null); setEditId(null);
        fetchData();
      } else setError(result.message || 'Terjadi kesalahan');
    } catch (err) { setError('Gagal terhubung ke server'); }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({ nama: item.nama, jabatan: item.jabatan, jenis: item.jenis });
    setError(''); setSuccess('');
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin mau hapus data ini?')) return;
    try {
      const res = await fetch(`${BASE_URL}/tentang/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) { setSuccess(result.message); fetchData(); }
    } catch (err) { setError('Gagal menghapus data'); }
  };

  const handleCancel = () => {
    setEditId(null);
    setForm({ nama: '', jabatan: '', jenis: 'struktur_organisasi' });
    setFotoFile(null); setError(''); setSuccess('');
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.6rem' }}>Kelola Tentang</h1>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {success && <div className="alert-success">{success}</div>}

      {/* Form */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '16px', marginBottom: '16px' }}>{editId ? 'Edit Data' : 'Tambah Data Baru'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Jenis</label>
            <select name="jenis" value={form.jenis} onChange={handleChange}>
              <option value="struktur_organisasi">Struktur Organisasi</option>
              <option value="surveyor">Surveyor</option>
              <option value="peneliti">Peneliti</option>
            </select>
          </div>
          <div className="form-group">
            <label>Nama</label>
            <input type="text" name="nama" value={form.nama} onChange={handleChange} required placeholder="Nama lengkap..." />
          </div>
          <div className="form-group">
            <label>Jabatan</label>
            <input type="text" name="jabatan" value={form.jabatan} onChange={handleChange} required placeholder="Jabatan..." />
          </div>
          <div className="form-group">
            <label>Foto (jpg/png, maks 2MB)</label>
            <input type="file" accept="image/jpg,image/jpeg,image/png" onChange={(e) => setFotoFile(e.target.files[0])} />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" className="btn-primary">{editId ? 'Simpan Perubahan' : 'Tambah Data'}</button>
            {editId && <button type="button" onClick={handleCancel} className="btn-gray">Batal</button>}
          </div>
        </form>
      </div>

      {/* Filter Jenis */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {Object.entries(jenisLabel).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilterJenis(key)}
            style={{
              padding: '7px 16px',
              borderRadius: '6px',
              border: 'none',
              background: filterJenis === key ? '#1a3a5c' : '#e2e8f0',
              color: filterJenis === key ? 'white' : '#4a5568',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '13px'
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      <h2 style={{ fontSize: '16px', marginBottom: '16px' }}>Daftar {jenisLabel[filterJenis]} ({data.length})</h2>
      {loading ? <p>Memuat data...</p> : data.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>Belum ada data {jenisLabel[filterJenis]}.</div>
      ) : (
        data.map((item) => (
          <div key={item.id} className="card" style={{ marginBottom: '12px', display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, color: '#1a3a5c', marginBottom: '4px' }}>{item.nama}</div>
              <div style={{ color: '#718096', fontSize: '13px' }}>{item.jabatan}</div>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              <button onClick={() => handleEdit(item)} className="btn-warning">Edit</button>
              <button onClick={() => handleDelete(item.id)} className="btn-danger">Hapus</button>
            </div>
          </div>
        ))
      )}
    </AdminLayout>
  );
}

export default KelolaTentang;
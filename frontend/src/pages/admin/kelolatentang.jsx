import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

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
        setFotoFile(null);
        setEditId(null);
        fetchData();
      } else {
        setError(result.message || 'Terjadi kesalahan');
      }
    } catch (err) {
      setError('Gagal terhubung ke server');
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({ nama: item.nama, jabatan: item.jabatan, jenis: item.jenis });
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin mau hapus data ini?')) return;

    try {
      const res = await fetch(`${BASE_URL}/tentang/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const result = await res.json();
      if (result.success) {
        setSuccess(result.message);
        fetchData();
      }
    } catch (err) {
      setError('Gagal menghapus data');
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setForm({ nama: '', jabatan: '', jenis: 'struktur_organisasi' });
    setFotoFile(null);
    setError('');
    setSuccess('');
  };

  const jenisLabel = {
    struktur_organisasi: 'Struktur Organisasi',
    surveyor: 'Surveyor',
    peneliti: 'Peneliti'
  };

  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>Kelola Tentang</h1>
        <button onClick={() => navigate('/admin/dashboard')}
          style={{ padding: '8px 16px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          ← Kembali
        </button>
      </div>

      {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '4px', marginBottom: '16px' }}>{error}</div>}
      {success && <div style={{ background: '#dcfce7', color: '#16a34a', padding: '10px', borderRadius: '4px', marginBottom: '16px' }}>{success}</div>}

      <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '24px', marginBottom: '32px' }}>
        <h2 style={{ margin: '0 0 16px', fontSize: '18px' }}>{editId ? 'Edit Data' : 'Tambah Data Baru'}</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '12px' }}>
            <label>Jenis</label>
            <select name="jenis" value={form.jenis} onChange={handleChange}
              style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}>
              <option value="struktur_organisasi">Struktur Organisasi</option>
              <option value="surveyor">Surveyor</option>
              <option value="peneliti">Peneliti</option>
            </select>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label>Nama</label>
            <input type="text" name="nama" value={form.nama} onChange={handleChange} required
              style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label>Jabatan</label>
            <input type="text" name="jabatan" value={form.jabatan} onChange={handleChange} required
              style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label>Foto (jpg/png, maks 2MB)</label>
            <input type="file" accept="image/jpg,image/jpeg,image/png" onChange={(e) => setFotoFile(e.target.files[0])}
              style={{ display: 'block', marginTop: '4px' }} />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit"
              style={{ padding: '8px 24px', background: '#16213e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              {editId ? 'Simpan Perubahan' : 'Tambah Data'}
            </button>
            {editId && (
              <button type="button" onClick={handleCancel}
                style={{ padding: '8px 24px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Filter Jenis */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {Object.entries(jenisLabel).map(([key, label]) => (
          <button key={key} onClick={() => setFilterJenis(key)}
            style={{ padding: '6px 16px', background: filterJenis === key ? '#16213e' : '#e5e7eb', color: filterJenis === key ? 'white' : '#374151', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            {label}
          </button>
        ))}
      </div>

      <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Daftar {jenisLabel[filterJenis]}</h2>
      {loading ? <p>Memuat data...</p> : data.length === 0 ? <p>Belum ada data.</p> : (
        data.map((item) => (
          <div key={item.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', marginBottom: '12px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{item.nama}</div>
            <div style={{ color: '#6b7280', marginBottom: '12px' }}>{item.jabatan}</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => handleEdit(item)}
                style={{ padding: '4px 12px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Edit
              </button>
              <button onClick={() => handleDelete(item.id)}
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

export default KelolaTentang;
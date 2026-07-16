import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function KelolaProfilAlumni() {
  const navigate = useNavigate();
  const [alumnis, setAlumnis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ nama: '', tahun_lulus: '', deskripsi_profesi: '' });
  const [fotoFile, setFotoFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('token');
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchAlumni = async () => {
    try {
      const res = await fetch(`${BASE_URL}/profil-alumni`);
      const result = await res.json();
      if (result.success) setAlumnis(result.data.data || result.data);
    } catch (err) {
      setError('Gagal mengambil data alumni');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) { navigate('/admin/login'); return; }
    fetchAlumni();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('nama', form.nama);
    formData.append('tahun_lulus', form.tahun_lulus);
    formData.append('deskripsi_profesi', form.deskripsi_profesi);
    if (fotoFile) formData.append('foto', fotoFile);
    if (editId) formData.append('_method', 'PUT');

    const url = editId ? `${BASE_URL}/profil-alumni/${editId}` : `${BASE_URL}/profil-alumni`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const result = await res.json();

      if (result.success) {
        setSuccess(result.message);
        setForm({ nama: '', tahun_lulus: '', deskripsi_profesi: '' });
        setFotoFile(null);
        setEditId(null);
        fetchAlumni();
      } else {
        setError(result.message || 'Terjadi kesalahan');
      }
    } catch (err) {
      setError('Gagal terhubung ke server');
    }
  };

  const handleEdit = (alumni) => {
    setEditId(alumni.id);
    setForm({ nama: alumni.nama, tahun_lulus: alumni.tahun_lulus, deskripsi_profesi: alumni.deskripsi_profesi });
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin mau hapus profil alumni ini?')) return;

    try {
      const res = await fetch(`${BASE_URL}/profil-alumni/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const result = await res.json();
      if (result.success) {
        setSuccess(result.message);
        fetchAlumni();
      }
    } catch (err) {
      setError('Gagal menghapus profil alumni');
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setForm({ nama: '', tahun_lulus: '', deskripsi_profesi: '' });
    setFotoFile(null);
    setError('');
    setSuccess('');
  };

  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>Kelola Profil Alumni</h1>
        <button
          onClick={() => navigate('/admin/dashboard')}
          style={{ padding: '8px 16px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          ← Kembali
        </button>
      </div>

      {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '4px', marginBottom: '16px' }}>{error}</div>}
      {success && <div style={{ background: '#dcfce7', color: '#16a34a', padding: '10px', borderRadius: '4px', marginBottom: '16px' }}>{success}</div>}

      <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '24px', marginBottom: '32px' }}>
        <h2 style={{ margin: '0 0 16px', fontSize: '18px' }}>{editId ? 'Edit Profil Alumni' : 'Tambah Profil Alumni'}</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '12px' }}>
            <label>Nama</label>
            <input type="text" name="nama" value={form.nama} onChange={handleChange} required
              style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label>Tahun Lulus</label>
            <input type="number" name="tahun_lulus" value={form.tahun_lulus} onChange={handleChange} required min="2000" max="2099"
              style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label>Deskripsi Profesi</label>
            <textarea name="deskripsi_profesi" value={form.deskripsi_profesi} onChange={handleChange} required rows={3}
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
              {editId ? 'Simpan Perubahan' : 'Tambah Alumni'}
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

      <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Daftar Profil Alumni</h2>
      {loading ? <p>Memuat data...</p> : alumnis.length === 0 ? <p>Belum ada profil alumni.</p> : (
        alumnis.map((alumni) => (
          <div key={alumni.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', marginBottom: '12px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{alumni.nama}</div>
            <div style={{ color: '#6b7280', marginBottom: '4px' }}>Tahun Lulus: {alumni.tahun_lulus}</div>
            <div style={{ color: '#6b7280', marginBottom: '12px' }}>{alumni.deskripsi_profesi}</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => handleEdit(alumni)}
                style={{ padding: '4px 12px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Edit
              </button>
              <button onClick={() => handleDelete(alumni.id)}
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

export default KelolaProfilAlumni;
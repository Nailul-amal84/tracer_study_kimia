import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';

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

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
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
        setFotoFile(null); setEditId(null);
        fetchAlumni();
      } else setError(result.message || 'Terjadi kesalahan');
    } catch (err) { setError('Gagal terhubung ke server'); }
  };

  const handleEdit = (alumni) => {
    setEditId(alumni.id);
    setForm({ nama: alumni.nama, tahun_lulus: alumni.tahun_lulus, deskripsi_profesi: alumni.deskripsi_profesi });
    setError(''); setSuccess('');
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin mau hapus profil alumni ini?')) return;
    try {
      const res = await fetch(`${BASE_URL}/profil-alumni/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) { setSuccess(result.message); fetchAlumni(); }
    } catch (err) { setError('Gagal menghapus profil alumni'); }
  };

  const handleCancel = () => {
    setEditId(null);
    setForm({ nama: '', tahun_lulus: '', deskripsi_profesi: '' });
    setFotoFile(null); setError(''); setSuccess('');
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.6rem' }}>Kelola Profil Alumni</h1>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {success && <div className="alert-success">{success}</div>}

      {/* Form */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '16px', marginBottom: '16px' }}>{editId ? 'Edit Profil Alumni' : 'Tambah Profil Alumni'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nama</label>
            <input type="text" name="nama" value={form.nama} onChange={handleChange} required placeholder="Nama lengkap alumni..." />
          </div>
          <div className="form-group">
            <label>Tahun Lulus</label>
            <input type="number" name="tahun_lulus" value={form.tahun_lulus} onChange={handleChange} required min="2000" max="2099" placeholder="2023" />
          </div>
          <div className="form-group">
            <label>Deskripsi Profesi</label>
            <textarea name="deskripsi_profesi" value={form.deskripsi_profesi} onChange={handleChange} required rows={3} placeholder="Contoh: Software Engineer di PT Maju Jaya" />
          </div>
          <div className="form-group">
            <label>Foto (jpg/png, maks 2MB)</label>
            <input type="file" accept="image/jpg,image/jpeg,image/png" onChange={(e) => setFotoFile(e.target.files[0])} />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" className="btn-primary">{editId ? 'Simpan Perubahan' : 'Tambah Alumni'}</button>
            {editId && <button type="button" onClick={handleCancel} className="btn-gray">Batal</button>}
          </div>
        </form>
      </div>

      {/* List */}
      <h2 style={{ fontSize: '16px', marginBottom: '16px' }}>Daftar Profil Alumni ({alumnis.length})</h2>
      {loading ? <p>Memuat data...</p> : alumnis.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>Belum ada profil alumni.</div>
      ) : (
        alumnis.map((alumni) => (
          <div key={alumni.id} className="card" style={{ marginBottom: '12px', display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, color: '#1a3a5c', marginBottom: '4px' }}>{alumni.nama}</div>
              <div style={{ fontSize: '12px', color: '#2b6cb0', fontWeight: 600, marginBottom: '4px' }}>Lulus {alumni.tahun_lulus}</div>
              <div style={{ color: '#718096', fontSize: '13px' }}>{alumni.deskripsi_profesi}</div>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              <button onClick={() => handleEdit(alumni)} className="btn-warning">Edit</button>
              <button onClick={() => handleDelete(alumni.id)} className="btn-danger">Hapus</button>
            </div>
          </div>
        ))
      )}
    </AdminLayout>
  );
}

export default KelolaProfilAlumni;
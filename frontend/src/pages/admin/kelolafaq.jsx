import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';

function KelolaFaq() {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ pertanyaan: '', jawaban: '' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('token');
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Ambil semua FAQ
  const fetchFaq = async () => {
    try {
      const res = await fetch(`${BASE_URL}/faq`);
      const result = await res.json();
      if (result.success) setFaqs(result.data);
    } catch (err) {
      setError('Gagal mengambil data FAQ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) { navigate('/admin/login'); return; }
    fetchFaq();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Tambah atau Update FAQ
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const url = editId ? `${BASE_URL}/faq/${editId}` : `${BASE_URL}/faq`;
    const method = editId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const result = await res.json();

      if (result.success) {
        setSuccess(result.message);
        setForm({ pertanyaan: '', jawaban: '' });
        setEditId(null);
        fetchFaq();
      } else {
        setError(result.message || 'Terjadi kesalahan');
      }
    } catch (err) {
      setError('Gagal terhubung ke server');
    }
  };

  // Set form untuk edit
  const handleEdit = (faq) => {
    setEditId(faq.id);
    setForm({ pertanyaan: faq.pertanyaan, jawaban: faq.jawaban });
    setError('');
    setSuccess('');
  };

  // Hapus FAQ
  const handleDelete = async (id) => {
    if (!confirm('Yakin mau hapus FAQ ini?')) return;

    try {
      const res = await fetch(`${BASE_URL}/faq/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const result = await res.json();
      if (result.success) {
        setSuccess(result.message);
        fetchFaq();
      }
    } catch (err) {
      setError('Gagal menghapus FAQ');
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setForm({ pertanyaan: '', jawaban: '' });
    setError('');
    setSuccess('');
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.6rem' }}>Kelola FAQ</h1>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {success && <div className="alert-success">{success}</div>}

      {/* Form */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '16px', marginBottom: '16px' }}>{editId ? 'Edit FAQ' : 'Tambah FAQ Baru'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Pertanyaan</label>
            <input type="text" name="pertanyaan" value={form.pertanyaan} onChange={handleChange} required placeholder="Tulis pertanyaan..." />
          </div>
          <div className="form-group">
            <label>Jawaban</label>
            <textarea name="jawaban" value={form.jawaban} onChange={handleChange} required rows={4} placeholder="Tulis jawaban..." />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" className="btn-primary">{editId ? 'Simpan Perubahan' : 'Tambah FAQ'}</button>
            {editId && <button type="button" onClick={handleCancel} className="btn-gray">Batal</button>}
          </div>
        </form>
      </div>

      {/* List */}
      <h2 style={{ fontSize: '16px', marginBottom: '16px' }}>Daftar FAQ ({faqs.length})</h2>
      {loading ? <p>Memuat data...</p> : faqs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>Belum ada FAQ.</div>
      ) : (
        faqs.map((faq) => (
          <div key={faq.id} className="card" style={{ marginBottom: '12px' }}>
            <div style={{ fontWeight: 600, color: '#1a3a5c', marginBottom: '6px' }}>{faq.pertanyaan}</div>
            <div style={{ color: '#718096', fontSize: '14px', marginBottom: '14px' }}>{faq.jawaban}</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => handleEdit(faq)} className="btn-warning">Edit</button>
              <button onClick={() => handleDelete(faq.id)} className="btn-danger">Hapus</button>
            </div>
          </div>
        ))
      )}
    </AdminLayout>
  );
}

export default KelolaFaq;
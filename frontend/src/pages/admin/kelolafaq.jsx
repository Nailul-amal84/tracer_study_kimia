import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>Kelola FAQ</h1>
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
        <h2 style={{ margin: '0 0 16px', fontSize: '18px' }}>{editId ? 'Edit FAQ' : 'Tambah FAQ Baru'}</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '12px' }}>
            <label>Pertanyaan</label>
            <input
              type="text"
              name="pertanyaan"
              value={form.pertanyaan}
              onChange={handleChange}
              required
              style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label>Jawaban</label>
            <textarea
              name="jawaban"
              value={form.jawaban}
              onChange={handleChange}
              required
              rows={4}
              style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="submit"
              style={{ padding: '8px 24px', background: '#16213e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              {editId ? 'Simpan Perubahan' : 'Tambah FAQ'}
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

      {/* List FAQ */}
      <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Daftar FAQ</h2>
      {loading ? (
        <p>Memuat data...</p>
      ) : faqs.length === 0 ? (
        <p>Belum ada FAQ.</p>
      ) : (
        faqs.map((faq) => (
          <div key={faq.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', marginBottom: '12px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{faq.pertanyaan}</div>
            <div style={{ color: '#6b7280', marginBottom: '12px' }}>{faq.jawaban}</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleEdit(faq)}
                style={{ padding: '4px 12px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(faq.id)}
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

export default KelolaFaq;
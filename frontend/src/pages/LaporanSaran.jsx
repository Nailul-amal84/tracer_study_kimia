import { useState } from 'react';
import { kirimLaporanSaran } from '../services/api';
import Breadcrumb from '../components/breadcrumb';

function LaporanSaran() {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [pesan, setPesan] = useState('');
  const [statusKirim, setStatusKirim] = useState(null); // null | 'loading' | 'sukses' | 'gagal'

  async function handleSubmit(e) {
    e.preventDefault(); // mencegah browser reload halaman saat submit
    setStatusKirim('loading');

    const hasil = await kirimLaporanSaran({ nama, email, pesan });

    if (hasil.success) {
      setStatusKirim('sukses');
      setNama('');
      setEmail('');
      setPesan('');
    } else {
      setStatusKirim('gagal');
    }
  }

  return (
    <div>
      <Breadcrumb items={[
        { label: 'Beranda', url: '/' },
        { label: 'Laporan & Saran' },
      ]} />
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a3a5c 0%, #0f2540 100%)',
        padding: '48px 24px',
        textAlign: 'center',
        color: 'white'
      }}>
        <h1 style={{ color: 'white', marginBottom: '8px' }}>Laporan & Saran</h1>
        <p style={{ color: 'rgba(255,255,255,0.75)' }}>
          Sampaikan masukan, laporan, atau saran kamu kepada kami
        </p>
      </div>

      {/* Content */}
      <div className="page-content" style={{ maxWidth: '600px' }}>

        {statusKirim === 'sukses' && (
          <div className="alert-success" style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
            <div style={{ fontWeight: 600, marginBottom: '4px', color: '#276749' }}>Pesan Terkirim!</div>
            <div style={{ color: '#2f855a', fontSize: '14px' }}>Terima kasih, masukan Anda sudah kami terima.</div>
          </div>
        )}

        {statusKirim === 'gagal' && (
          <div className="alert-error">
            Gagal mengirim pesan. Silakan coba lagi.
          </div>
        )}

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nama Lengkap</label>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                required
                placeholder="Masukkan nama lengkap kamu"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="contoh@email.com"
              />
            </div>

            <div className="form-group">
              <label>Pesan / Saran</label>
              <textarea
                value={pesan}
                onChange={(e) => setPesan(e.target.value)}
                required
                rows={5}
                placeholder="Tulis pesan atau saran kamu di sini..."
              />
            </div>

            <button
              type="submit"
              disabled={statusKirim === 'loading'}
              className="btn-primary"
              style={{ width: '100%', padding: '12px' }}
            >
              {statusKirim === 'loading' ? 'Mengirim...' : 'Kirim Pesan'}
            </button>
          </form>
        </div>

        {/* Info */}
        <div style={{
          marginTop: '24px',
          padding: '16px 20px',
          background: '#ebf8ff',
          border: '1px solid #bee3f8',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#2b6cb0'
        }}>
          💡 Pesan kamu akan langsung diterima oleh tim pengelola Tracer Study Kimia UINAR.
        </div>
      </div>
    </div>
  );
}

export default LaporanSaran;
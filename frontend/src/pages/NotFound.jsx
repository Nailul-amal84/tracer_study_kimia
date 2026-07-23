import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f7f9fc',
      padding: '24px'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        <div style={{
          fontSize: '120px',
          fontWeight: 800,
          color: '#e2e8f0',
          lineHeight: 1,
          marginBottom: '8px'
        }}>
          404
        </div>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>😕</div>
        <h1 style={{ fontSize: '1.6rem', color: '#1a3a5c', marginBottom: '8px' }}>
          Halaman Tidak Ditemukan
        </h1>
        <p style={{ color: '#718096', marginBottom: '32px', lineHeight: 1.7 }}>
          Halaman yang kamu cari tidak ada atau sudah dipindahkan.
          Coba kembali ke beranda.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary"
          >
            ← Kembali
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            🏠 Ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
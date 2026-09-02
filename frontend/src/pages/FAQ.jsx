import { useState, useEffect } from 'react';
import { getFaq } from '../services/api';
import Spinner from '../components/Spinner';
import Breadcrumb from '../components/breadcrumb';

function FAQ() {
  const [daftarFaq, setDaftarFaq] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aktifId, setAktifId] = useState(null);

  useEffect(() => {
    getFaq().then((result) => {
      setDaftarFaq(result.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <Breadcrumb items={[
        { label: 'Beranda', url: '/' },
        { label: 'FAQ' },
      ]} />
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a3a5c 0%, #0f2540 100%)',
        padding: '48px 24px',
        textAlign: 'center',
        color: 'white'
      }}>
        <h1 style={{ color: 'white', marginBottom: '8px' }}>FAQ</h1>
        <p style={{ color: 'rgba(255,255,255,0.75)' }}>Pertanyaan yang sering ditanyakan</p>
      </div>

      {/* Content */}
      <div className="page-content" style={{ maxWidth: '800px' }}>
        {loading ? (
          <p>Memuat data...</p>
        ) : daftarFaq.length === 0 ? (
          <p>Belum ada FAQ.</p>
        ) : (
          daftarFaq.map((item) => (
            <div
              key={item.id}
              style={{
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                marginBottom: '12px',
                overflow: 'hidden',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
              }}
            >
              {/* Pertanyaan */}
              <button
                onClick={() => setAktifId(aktifId === item.id ? null : item.id)}
                style={{
                  width: '100%',
                  padding: '18px 20px',
                  background: 'none',
                  border: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  textAlign: 'left',
                  gap: '12px'
                }}
              >
                <span style={{ fontWeight: 600, color: '#1a3a5c', fontSize: '15px' }}>
                  {item.pertanyaan}
                </span>
                <span style={{
                  fontSize: '18px',
                  color: '#1a3a5c',
                  transform: aktifId === item.id ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.2s ease',
                  flexShrink: 0
                }}>
                  ▾
                </span>
              </button>

              {/* Jawaban */}
              {aktifId === item.id && (
                <div style={{
                  padding: '0 20px 18px',
                  borderTop: '1px solid #e2e8f0',
                  paddingTop: '16px'
                }}>
                  <p style={{ color: '#4a5568', lineHeight: 1.7, margin: 0 }}>{item.jawaban}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default FAQ;
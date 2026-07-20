import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTentang } from '../services/api';

const judulPerJenis = {
  "struktur_organisasi": "Struktur Organisasi",
  "surveyor": "Surveyor",
  "peneliti": "Peneliti",
};

const deskripsiPerJenis = {
  'struktur_organisasi': 'Daftar pengurus dan struktur organisasi Program Studi Kimia UIN Ar-Raniry',
  'surveyor': 'Tim surveyor yang bertugas mengumpulkan data tracer study',
  'peneliti': 'Tim peneliti yang menganalisis dan mengolah data hasil tracer study',
};

function Tentang() {
  const { jenis } = useParams();
  const [daftar, setDaftar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getTentang(jenis).then((result) => {
      setDaftar(result.data);
      setLoading(false);
    });
  }, [jenis]);

  if (loading) return <p>Memuat data...</p>;

  return (
    <div>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a3a5c 0%, #0f2540 100%)',
        padding: '48px 24px',
        textAlign: 'center',
        color: 'white'
      }}>
        <h1 style={{ color: 'white', marginBottom: '8px' }}>
          {judulPerJenis[jenis] || 'Tentang'}
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.75)' }}>
          {deskripsiPerJenis[jenis] || ''}
        </p>
      </div>

      {/* Tab navigasi */}
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          gap: '4px'
        }}>
          {Object.entries(judulPerJenis).map(([key, label]) => (
            <Link
              key={key}
              to={`/tentang/${key}`}
              style={{
                padding: '14px 20px',
                fontWeight: 600,
                fontSize: '14px',
                color: jenis === key ? '#1a3a5c' : '#718096',
                borderBottom: jenis === key ? '2px solid #1a3a5c' : '2px solid transparent',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="page-content">
        {loading ? (
          <p>Memuat data...</p>
        ) : daftar.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#718096' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
            <p>Belum ada data {judulPerJenis[jenis]}.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '20px'
          }}>
            {daftar.map((item) => (
              <div key={item.id} className="card" style={{ textAlign: 'center' }}>
                {item.foto ? (
                  <img
                    src={`http://127.0.0.1:8000/storage/${item.foto}`}
                    alt={item.nama}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      marginBottom: '12px',
                      border: '3px solid #e2e8f0'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1a3a5c, #2d5986)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                    fontSize: '28px',
                    color: 'white',
                    fontWeight: 700
                  }}>
                    {item.nama.charAt(0)}
                  </div>
                )}
                <h3 style={{ marginBottom: '4px', fontSize: '15px' }}>{item.nama}</h3>
                <p style={{ fontSize: '13px', color: '#718096' }}>{item.jabatan}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Tentang;
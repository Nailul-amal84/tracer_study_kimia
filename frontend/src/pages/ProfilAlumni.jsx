import { useState, useEffect } from 'react';
import { getProfilAlumni } from '../services/api';
import Spinner from '../components/Spinner';

function ProfilAlumni() {
  const [daftarAlumni, setDaftarAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTahun, setFilterTahun] = useState('');
  const [tahunList, setTahunList] = useState([]);

  useEffect(() => {
    getProfilAlumni().then((result) => {
      setDaftarAlumni(result.data.data || result.data);
      setLoading(false);
    });
  }, []);

  const filtered = filterTahun
    ? daftarAlumni.filter((a) => String(a.tahun_lulus) === filterTahun)
    : daftarAlumni;

  if (loading) return <Spinner />;

  return (
    <div>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a3a5c 0%, #0f2540 100%)',
        padding: '48px 24px',
        textAlign: 'center',
        color: 'white'
      }}>
        <h1 style={{ color: 'white', marginBottom: '8px' }}>Profil Alumni</h1>
        <p style={{ color: 'rgba(255,255,255,0.75)' }}>
          Alumni inspiratif Program Studi Kimia UIN Ar-Raniry
        </p>
      </div>

      {/* Content */}
      <div className="page-content">

        {/* Filter Tahun */}
        {!loading && tahunList.length > 0 && (
          <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 600, color: '#1a3a5c', fontSize: '14px' }}>Filter tahun:</span>
            <button
              onClick={() => setFilterTahun('')}
              style={{
                padding: '6px 16px',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                background: filterTahun === '' ? '#1a3a5c' : 'white',
                color: filterTahun === '' ? 'white' : '#4a5568',
                fontSize: '13px',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              Semua
            </button>
            {tahunList.map((tahun) => (
              <button
                key={tahun}
                onClick={() => setFilterTahun(String(tahun))}
                style={{
                  padding: '6px 16px',
                  borderRadius: '20px',
                  border: '1px solid #e2e8f0',
                  background: filterTahun === String(tahun) ? '#1a3a5c' : 'white',
                  color: filterTahun === String(tahun) ? 'white' : '#4a5568',
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                {tahun}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <p>Memuat data...</p>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#718096' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
            <p>Belum ada profil alumni.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '20px'
          }}>
            {filtered.map((alumni) => (
              <div key={alumni.id} className="card" style={{ textAlign: 'center' }}>
                {alumni.foto ? (
                  <img
                    src={`http://127.0.0.1:8000/storage/${alumni.foto}`}
                    alt={alumni.nama}
                    style={{
                      width: '90px',
                      height: '90px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      marginBottom: '12px',
                      border: '3px solid #e2e8f0'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1a3a5c, #2d5986)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                    fontSize: '32px',
                    color: 'white',
                    fontWeight: 700
                  }}>
                    {alumni.nama.charAt(0)}
                  </div>
                )}
                <h3 style={{ marginBottom: '4px', fontSize: '15px' }}>{alumni.nama}</h3>
                <div style={{
                  display: 'inline-block',
                  background: '#ebf8ff',
                  color: '#2b6cb0',
                  fontSize: '12px',
                  fontWeight: 600,
                  padding: '2px 10px',
                  borderRadius: '12px',
                  marginBottom: '8px'
                }}>
                  Lulus {alumni.tahun_lulus}
                </div>
                <p style={{ fontSize: '13px', color: '#718096', lineHeight: 1.6 }}>
                  {alumni.deskripsi_profesi}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilAlumni;
import { useState, useEffect } from 'react';
import { getProfilAlumni } from '../services/api';

function ProfilAlumni() {
  const [daftarAlumni, setDaftarAlumni] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfilAlumni().then((result) => {
      setDaftarAlumni(result.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Memuat data...</p>;

  return (
    <div>
      <h1>Profil Alumni</h1>
      {daftarAlumni.map((item) => (
        <div key={item.id}>
          <h3>{item.nama}</h3>
          <p>Lulus tahun {item.tahun_lulus}</p>
          <p>{item.deskripsi_profesi}</p>
        </div>
      ))}
    </div>
  );
}

export default ProfilAlumni;
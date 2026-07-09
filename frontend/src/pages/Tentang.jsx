import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getTentang } from '../services/api';

const judulPerJenis = {
  "struktur-organisasi": "Struktur Organisasi",
  "surveyor": "Surveyor",
  "peneliti": "Peneliti",
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
      <h1>{judulPerJenis[jenis] || 'Tentang'}</h1>
      {daftar.map((item) => (
        <div key={item.id}>
          <h3>{item.nama}</h3>
          <p>{item.jabatan}</p>
        </div>
      ))}
    </div>
  );
}

export default Tentang;
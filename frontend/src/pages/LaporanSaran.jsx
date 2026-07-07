import { useState } from 'react';
import { kirimLaporanSaran } from '../services/api';

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
      <h1>Laporan & Saran</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nama</label>
          <br />
          <input
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Pesan</label>
          <br />
          <textarea
            value={pesan}
            onChange={(e) => setPesan(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={statusKirim === 'loading'}>
          {statusKirim === 'loading' ? 'Mengirim...' : 'Kirim'}
        </button>
      </form>

      {statusKirim === 'sukses' && <p>Terima kasih, masukan Anda sudah kami terima!</p>}
      {statusKirim === 'gagal' && <p>Gagal mengirim, coba lagi.</p>}
    </div>
  );
}

export default LaporanSaran;
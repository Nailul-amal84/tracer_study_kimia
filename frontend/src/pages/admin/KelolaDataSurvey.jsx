import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';

const ASPEK_PENGGUNA = [
  'Etika',
  'Keahlian pada bidang ilmu (kompetensi utama)',
  'Kemampuan berbahasa asing',
  'Penggunaan teknologi informasi',
  'Kemampuan berkomunikasi',
  'Kerjasama',
  'Pengembangan diri',
];

const ASPEK_MAHASISWA = [
  'Keandalan (reliability): kemampuan dosen, tenaga kependidikan, dan pengelola dalam memberikan pelayanan',
  'Daya tanggap (responsiveness): kemauan dosen, tenaga kependidikan, dan pengelola membantu mahasiswa dengan cepat',
  'Kepastian (assurance): kemampuan dosen, tenaga kependidikan, dan pengelola memberi keyakinan pelayanan sesuai ketentuan',
  'Empati (empathy): kesediaan/kepedulian dosen, tenaga kependidikan, dan pengelola memberi perhatian kepada mahasiswa',
  'Tangible: penilaian mahasiswa terhadap kecukupan, aksesibitas, kualitas sarana dan prasarana',
];

const PERIODE_DEFAULT = '2026/2027';

function KelolaDataSurvey() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [tracers, setTracers] = useState([]);
  const [selectedTracer, setSelectedTracer] = useState('');
  const [selectedTracerId, setSelectedTracerId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [periodeList, setPeriodeList] = useState([]);
  const [selectedPeriode, setSelectedPeriode] = useState('');
  const [periodeBaru, setPeriodeBaru] = useState('');

  const daftarAspek = selectedTracer === 'mahasiswa' ? ASPEK_MAHASISWA : ASPEK_PENGGUNA;

  const [dataList, setDataList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    tracer_study_id: '', periode: '', tahun_lulus: '', jumlah_lulusan: '', jumlah_terlacak: '',
    dipesan_sebelum_lulus: '', wt_kurang_6_bulan: '', wt_6_18_bulan: '', wt_lebih_18_bulan: '',
  });

  const [referensiList, setReferensiList] = useState([]);
  const [editReferensiId, setEditReferensiId] = useState(null);
  const [formReferensi, setFormReferensi] = useState({ periode: '', tahun_lulus: '', jumlah_lulusan: '', jumlah_terlacak: '' });

  const [kepuasanList, setKepuasanList] = useState([]);
  const [editKepuasanId, setEditKepuasanId] = useState(null);
  const [formKepuasan, setFormKepuasan] = useState({ periode: '', jenis_kemampuan: ASPEK_PENGGUNA[0], sangat_baik: '', baik: '', cukup: '', kurang: '' });

  useEffect(() => {
    if (!token) { navigate('/admin/login'); return; }
    fetch(`${BASE_URL}/tracer-study`)
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          setTracers(result.data);
          if (result.data.length > 0) handleTracerChange(result.data[0]);
        }
      });
  }, []);

  const resetPesan = () => { setError(''); setSuccess(''); };

  const handleTracerChange = (tracer) => {
    setSelectedTracer(tracer.jenis);
    setSelectedTracerId(tracer.id);
    setEditId(null);
    setEditReferensiId(null);
    setEditKepuasanId(null);
    setSelectedPeriode('');
    setPeriodeList([]);
    resetPesan();
  };

  useEffect(() => {
    if (!selectedTracer) return;
    setLoading(true);

    const qs = selectedPeriode ? `?periode=${encodeURIComponent(selectedPeriode)}` : '';

    if (selectedTracer === 'pengguna_lulusan') {
      Promise.all([
        fetch(`${BASE_URL}/referensi-pengguna/${selectedTracer}${qs}`).then(res => res.json()),
        fetch(`${BASE_URL}/kepuasan-pengguna/${selectedTracer}${qs}`).then(res => res.json()),
      ]).then(([referensiResult, kepuasanResult]) => {
        if (referensiResult.success) {
          setReferensiList(referensiResult.data);
          setPeriodeList(referensiResult.periode_list || []);
          if (!selectedPeriode) setSelectedPeriode(referensiResult.periode || PERIODE_DEFAULT);
        }
        if (kepuasanResult.success) setKepuasanList(kepuasanResult.data);
      }).finally(() => setLoading(false));
    } else if (selectedTracer === 'mahasiswa') {
      fetch(`${BASE_URL}/kepuasan-pengguna/${selectedTracer}${qs}`)
        .then(res => res.json())
        .then(result => {
          if (result.success) {
            setKepuasanList(result.data);
            setPeriodeList(result.periode_list || []);
            if (!selectedPeriode) setSelectedPeriode(result.periode || PERIODE_DEFAULT);
          }
        })
        .finally(() => setLoading(false));
    } else {
      fetch(`${BASE_URL}/data-survey/${selectedTracer}${qs}`)
        .then(res => res.json())
        .then(result => {
          if (result.success) {
            setDataList(result.data);
            setPeriodeList(result.periode_list || []);
            if (!selectedPeriode) setSelectedPeriode(result.periode || PERIODE_DEFAULT);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [selectedTracer, selectedPeriode]);

  const handleTambahPeriode = () => {
    const p = periodeBaru.trim();
    if (!p) return;
    setSelectedPeriode(p);
    setPeriodeBaru('');
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetPesan();
    const url = editId ? `${BASE_URL}/data-survey/${editId}` : `${BASE_URL}/data-survey`;
    const method = editId ? 'PUT' : 'POST';
    const body = editId ? form : { ...form, tracer_study_id: selectedTracerId, periode: selectedPeriode };
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(body)
      });
      const result = await res.json();
      if (result.success) {
        setSuccess(result.message);
        setForm(f => ({ ...f, tahun_lulus: '', jumlah_lulusan: '', jumlah_terlacak: '', dipesan_sebelum_lulus: '', wt_kurang_6_bulan: '', wt_6_18_bulan: '', wt_lebih_18_bulan: '' }));
        setEditId(null);
        fetch(`${BASE_URL}/data-survey/${selectedTracer}?periode=${encodeURIComponent(selectedPeriode)}`).then(res => res.json()).then(r => { if (r.success) { setDataList(r.data); setPeriodeList(r.periode_list || []); } });
      } else setError(result.message || 'Terjadi kesalahan');
    } catch (err) { setError('Gagal terhubung ke server'); }
  };

  const handleEdit = (item) => { setEditId(item.id); setForm({ ...item }); resetPesan(); };

  const handleDelete = async (id) => {
    if (!confirm('Yakin mau hapus data ini?')) return;
    const res = await fetch(`${BASE_URL}/data-survey/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    const result = await res.json();
    if (result.success) { setSuccess(result.message); setDataList(dataList.filter(d => d.id !== id)); }
  };

  const handleChangeReferensi = (e) => setFormReferensi({ ...formReferensi, [e.target.name]: e.target.value });

  const handleSubmitReferensi = async (e) => {
    e.preventDefault();
    resetPesan();
    const url = editReferensiId ? `${BASE_URL}/referensi-pengguna/${editReferensiId}` : `${BASE_URL}/referensi-pengguna`;
    const method = editReferensiId ? 'PUT' : 'POST';
    const body = editReferensiId ? formReferensi : { ...formReferensi, tracer_study_id: selectedTracerId, periode: selectedPeriode };
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(body)
      });
      const result = await res.json();
      if (result.success) {
        setSuccess(result.message);
        setFormReferensi({ periode: '', tahun_lulus: '', jumlah_lulusan: '', jumlah_terlacak: '' });
        setEditReferensiId(null);
        fetch(`${BASE_URL}/referensi-pengguna/${selectedTracer}?periode=${encodeURIComponent(selectedPeriode)}`).then(res => res.json()).then(r => { if (r.success) { setReferensiList(r.data); setPeriodeList(r.periode_list || []); } });
      } else setError(result.message || 'Terjadi kesalahan');
    } catch (err) { setError('Gagal terhubung ke server'); }
  };

  const handleEditReferensi = (item) => {
    setEditReferensiId(item.id);
    setFormReferensi({ periode: item.periode, tahun_lulus: item.tahun_lulus, jumlah_lulusan: item.jumlah_lulusan, jumlah_terlacak: item.jumlah_terlacak });
    resetPesan();
  };

  const handleDeleteReferensi = async (id) => {
    if (!confirm('Yakin mau hapus data ini?')) return;
    const res = await fetch(`${BASE_URL}/referensi-pengguna/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    const result = await res.json();
    if (result.success) { setSuccess(result.message); setReferensiList(referensiList.filter(d => d.id !== id)); }
  };

  const handleChangeKepuasan = (e) => setFormKepuasan({ ...formKepuasan, [e.target.name]: e.target.value });

  const handleSubmitKepuasan = async (e) => {
    e.preventDefault();
    resetPesan();
    const url = editKepuasanId ? `${BASE_URL}/kepuasan-pengguna/${editKepuasanId}` : `${BASE_URL}/kepuasan-pengguna`;
    const method = editKepuasanId ? 'PUT' : 'POST';
    const body = editKepuasanId ? formKepuasan : { ...formKepuasan, tracer_study_id: selectedTracerId, periode: selectedPeriode };
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(body)
      });
      const result = await res.json();
      if (result.success) {
        setSuccess(result.message);
        setFormKepuasan({ periode: '', jenis_kemampuan: daftarAspek[0], sangat_baik: '', baik: '', cukup: '', kurang: '' });
        setEditKepuasanId(null);
        fetch(`${BASE_URL}/kepuasan-pengguna/${selectedTracer}?periode=${encodeURIComponent(selectedPeriode)}`).then(res => res.json()).then(r => { if (r.success) { setKepuasanList(r.data); setPeriodeList(r.periode_list || []); } });
      } else setError(result.message || 'Terjadi kesalahan');
    } catch (err) { setError('Gagal terhubung ke server'); }
  };

  const handleEditKepuasan = (item) => {
    setEditKepuasanId(item.id);
    setFormKepuasan({ periode: item.periode, jenis_kemampuan: item.jenis_kemampuan, sangat_baik: item.sangat_baik, baik: item.baik, cukup: item.cukup, kurang: item.kurang });
    resetPesan();
  };

  const handleDeleteKepuasan = async (id) => {
    if (!confirm('Yakin mau hapus data ini?')) return;
    const res = await fetch(`${BASE_URL}/kepuasan-pengguna/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    const result = await res.json();
    if (result.success) { setSuccess(result.message); setKepuasanList(kepuasanList.filter(d => d.id !== id)); }
  };

  const inputStyle = { width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' };

  const renderPeriodeSelector = () => (
    <div className="card" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
      <label style={{ fontSize: '13px', fontWeight: 600, color: '#1a3a5c' }}>Periode Aktif:</label>
      <select
        value={selectedPeriode}
        onChange={(e) => setSelectedPeriode(e.target.value)}
        style={{ ...inputStyle, width: 'auto', minWidth: '140px' }}
      >
        {periodeList.length === 0 && <option value={selectedPeriode}>{selectedPeriode}</option>}
        {periodeList.map(p => <option key={p} value={p}>{p}</option>)}
      </select>
      <span style={{ fontSize: '13px', color: '#718096' }}>atau tambah periode baru:</span>
      <input
        type="text"
        value={periodeBaru}
        onChange={(e) => setPeriodeBaru(e.target.value)}
        placeholder="2027/2028"
        style={{ ...inputStyle, width: '140px' }}
      />
      <button type="button" onClick={handleTambahPeriode} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '13px' }}>
        + Gunakan Periode Ini
      </button>
    </div>
  );

  const renderKepuasanBlock = () => (
    <>
      <div className="card" style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '15px', marginBottom: '16px', color: '#1a3a5c' }}>
          {editKepuasanId ? 'Edit Data Kepuasan' : `Tambah Data Kepuasan — Periode ${selectedPeriode}`}
        </h2>
        <form onSubmit={handleSubmitKepuasan}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Aspek yang Diukur</label>
            <select name="jenis_kemampuan" value={formKepuasan.jenis_kemampuan} onChange={handleChangeKepuasan} style={inputStyle}>
              {daftarAspek.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Sangat Baik (%)</label>
              <input type="number" step="0.01" name="sangat_baik" value={formKepuasan.sangat_baik} onChange={handleChangeKepuasan} required min="0" max="100" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Baik (%)</label>
              <input type="number" step="0.01" name="baik" value={formKepuasan.baik} onChange={handleChangeKepuasan} required min="0" max="100" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Cukup (%)</label>
              <input type="number" step="0.01" name="cukup" value={formKepuasan.cukup} onChange={handleChangeKepuasan} required min="0" max="100" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Kurang (%)</label>
              <input type="number" step="0.01" name="kurang" value={formKepuasan.kurang} onChange={handleChangeKepuasan} required min="0" max="100" style={inputStyle} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" className="btn-primary">{editKepuasanId ? 'Simpan Perubahan' : 'Tambah Data'}</button>
            {editKepuasanId && <button type="button" onClick={() => { setEditKepuasanId(null); setFormKepuasan({ periode: '', jenis_kemampuan: daftarAspek[0], sangat_baik: '', baik: '', cukup: '', kurang: '' }); }} className="btn-gray">Batal</button>}
          </div>
        </form>
      </div>

      {kepuasanList.length > 0 && (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#1a3a5c', color: 'white' }}>
                <th style={{ padding: '10px 12px' }}>Aspek</th>
                <th style={{ padding: '10px 12px' }}>Sangat Baik</th>
                <th style={{ padding: '10px 12px' }}>Baik</th>
                <th style={{ padding: '10px 12px' }}>Cukup</th>
                <th style={{ padding: '10px 12px' }}>Kurang</th>
                <th style={{ padding: '10px 12px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {kepuasanList.map((item, i) => (
                <tr key={item.id} style={{ background: i % 2 === 0 ? 'white' : '#f7f9fc' }}>
                  <td style={{ padding: '10px 12px', maxWidth: '320px' }}>{item.jenis_kemampuan}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>{item.sangat_baik}%</td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>{item.baik}%</td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>{item.cukup}%</td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>{item.kurang}%</td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                      <button onClick={() => handleEditKepuasan(item)} className="btn-warning" style={{ padding: '4px 10px', fontSize: '12px' }}>Edit</button>
                      <button onClick={() => handleDeleteKepuasan(item.id)} className="btn-danger" style={{ padding: '4px 10px', fontSize: '12px' }}>Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.6rem' }}>Kelola Data Survey</h1>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {success && <div className="alert-success">{success}</div>}

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {tracers.map((tracer) => (
          <button
            key={tracer.jenis}
            onClick={() => handleTracerChange(tracer)}
            style={{
              padding: '8px 20px', borderRadius: '6px', border: 'none',
              background: selectedTracer === tracer.jenis ? '#1a3a5c' : '#e2e8f0',
              color: selectedTracer === tracer.jenis ? 'white' : '#4a5568',
              cursor: 'pointer', fontWeight: 500, fontSize: '14px'
            }}
          >
            {tracer.label}
          </button>
        ))}
      </div>

      {selectedTracer && renderPeriodeSelector()}

      {loading ? <p>Memuat data...</p> : selectedTracer === 'pengguna_lulusan' ? (
        <>
          <div className="card" style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '15px', marginBottom: '16px', color: '#1a3a5c' }}>
              {editReferensiId ? 'Edit Data Referensi' : `Tambah Data Referensi — Periode ${selectedPeriode}`}
            </h2>
            <form onSubmit={handleSubmitReferensi}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Tahun Lulus</label>
                  <input type="text" name="tahun_lulus" value={formReferensi.tahun_lulus} onChange={handleChangeReferensi} required placeholder="TS-2, TS-3, dst" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Jumlah Lulusan</label>
                  <input type="number" name="jumlah_lulusan" value={formReferensi.jumlah_lulusan} onChange={handleChangeReferensi} required min="0" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Jumlah Tanggapan Terlacak</label>
                  <input type="number" name="jumlah_terlacak" value={formReferensi.jumlah_terlacak} onChange={handleChangeReferensi} required min="0" style={inputStyle} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" className="btn-primary">{editReferensiId ? 'Simpan Perubahan' : 'Tambah Data'}</button>
                {editReferensiId && <button type="button" onClick={() => { setEditReferensiId(null); setFormReferensi({ periode: '', tahun_lulus: '', jumlah_lulusan: '', jumlah_terlacak: '' }); }} className="btn-gray">Batal</button>}
              </div>
            </form>
          </div>

          {referensiList.length > 0 && (
            <div className="card" style={{ marginBottom: '28px', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#1a3a5c', color: 'white' }}>
                    <th style={{ padding: '10px 12px' }}>Tahun Lulus</th>
                    <th style={{ padding: '10px 12px' }}>Jumlah Lulusan</th>
                    <th style={{ padding: '10px 12px' }}>Jumlah Tanggapan Terlacak</th>
                    <th style={{ padding: '10px 12px' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {referensiList.map((item, i) => (
                    <tr key={item.id} style={{ background: i % 2 === 0 ? 'white' : '#f7f9fc' }}>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>{item.tahun_lulus}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>{item.jumlah_lulusan}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>{item.jumlah_terlacak}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                          <button onClick={() => handleEditReferensi(item)} className="btn-warning" style={{ padding: '4px 10px', fontSize: '12px' }}>Edit</button>
                          <button onClick={() => handleDeleteReferensi(item.id)} className="btn-danger" style={{ padding: '4px 10px', fontSize: '12px' }}>Hapus</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {renderKepuasanBlock()}
        </>
      ) : selectedTracer === 'mahasiswa' ? (
        renderKepuasanBlock()
      ) : (
        <>
          <div className="card" style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '15px', marginBottom: '16px', color: '#1a3a5c' }}>
              {editId ? 'Edit Data Survey' : `Tambah Data Survey — Periode ${selectedPeriode}`}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Tahun Lulus</label>
                  <input type="text" name="tahun_lulus" value={form.tahun_lulus} onChange={handleChange} required placeholder="TS-2, TS-3, dst" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Jumlah Lulusan</label>
                  <input type="number" name="jumlah_lulusan" value={form.jumlah_lulusan} onChange={handleChange} required min="0" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Jumlah Terlacak</label>
                  <input type="number" name="jumlah_terlacak" value={form.jumlah_terlacak} onChange={handleChange} required min="0" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Dipesan Sebelum Lulus</label>
                  <input type="number" name="dipesan_sebelum_lulus" value={form.dipesan_sebelum_lulus} onChange={handleChange} required min="0" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>WT &lt; 6 Bulan</label>
                  <input type="number" name="wt_kurang_6_bulan" value={form.wt_kurang_6_bulan} onChange={handleChange} required min="0" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>6 ≤ WT ≤ 18 Bulan</label>
                  <input type="number" name="wt_6_18_bulan" value={form.wt_6_18_bulan} onChange={handleChange} required min="0" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>WT &gt; 18 Bulan</label>
                  <input type="number" name="wt_lebih_18_bulan" value={form.wt_lebih_18_bulan} onChange={handleChange} required min="0" style={inputStyle} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" className="btn-primary">{editId ? 'Simpan Perubahan' : 'Tambah Data'}</button>
                {editId && <button type="button" onClick={() => { setEditId(null); setForm(f => ({ ...f, tahun_lulus: '', jumlah_lulusan: '', jumlah_terlacak: '', dipesan_sebelum_lulus: '', wt_kurang_6_bulan: '', wt_6_18_bulan: '', wt_lebih_18_bulan: '' })); }} className="btn-gray">Batal</button>}
              </div>
            </form>
          </div>

          {dataList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
              Belum ada data survey untuk periode ini.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#1a3a5c', color: 'white' }}>
                    <th style={{ padding: '10px 12px' }} rowSpan="2">Tahun Lulus</th>
                    <th style={{ padding: '10px 12px' }} rowSpan="2">Jumlah Lulusan</th>
                    <th style={{ padding: '10px 12px' }} rowSpan="2">Jumlah Terlacak</th>
                    <th style={{ padding: '10px 12px' }} rowSpan="2">Dipesan Sebelum Lulus</th>
                    <th style={{ padding: '10px 12px' }} colSpan="3">Waktu Tunggu Mendapatkan Pekerjaan</th>
                    <th style={{ padding: '10px 12px' }} rowSpan="2">Aksi</th>
                  </tr>
                  <tr style={{ background: '#2d5986', color: 'white' }}>
                    <th style={{ padding: '8px 12px' }}>WT &lt; 6 Bulan</th>
                    <th style={{ padding: '8px 12px' }}>6 ≤ WT ≤ 18 Bulan</th>
                    <th style={{ padding: '8px 12px' }}>WT &gt; 18 Bulan</th>
                  </tr>
                </thead>
                <tbody>
                  {dataList.map((item, index) => (
                    <tr key={item.id} style={{ background: index % 2 === 0 ? 'white' : '#f7f9fc' }}>
                      <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 600 }}>{item.tahun_lulus}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>{item.jumlah_lulusan}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>{item.jumlah_terlacak}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>{item.dipesan_sebelum_lulus}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>{item.wt_kurang_6_bulan}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>{item.wt_6_18_bulan}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>{item.wt_lebih_18_bulan}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                          <button onClick={() => handleEdit(item)} className="btn-warning" style={{ padding: '4px 10px', fontSize: '12px' }}>Edit</button>
                          <button onClick={() => handleDelete(item.id)} className="btn-danger" style={{ padding: '4px 10px', fontSize: '12px' }}>Hapus</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}

export default KelolaDataSurvey;
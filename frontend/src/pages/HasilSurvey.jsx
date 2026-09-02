import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import Breadcrumb from '../components/breadcrumb';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

function HasilSurvey() {
  const { jenis } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [label, setLabel] = useState('');

  const [periodeList, setPeriodeList] = useState([]);
  const [selectedPeriode, setSelectedPeriode] = useState('');

  const [data, setData] = useState([]);
  const [total, setTotal] = useState(null);

  const [referensi, setReferensi] = useState([]);
  const [totalReferensi, setTotalReferensi] = useState(null);

  const [kepuasan, setKepuasan] = useState([]);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    setLoading(true);
    setSelectedPeriode('');
    const qs = '';

    if (jenis === 'pengguna_lulusan') {
      Promise.all([
        fetch(`${BASE_URL}/referensi-pengguna/${jenis}${qs}`).then(res => res.json()),
        fetch(`${BASE_URL}/kepuasan-pengguna/${jenis}${qs}`).then(res => res.json()),
      ]).then(([refResult, kepResult]) => {
        if (refResult.success) {
          setReferensi(refResult.data);
          setTotalReferensi(refResult.total);
          setPeriodeList(refResult.periode_list || []);
          setSelectedPeriode(refResult.periode || '');
        }
        if (kepResult.success) setKepuasan(kepResult.data);
        setLabel('Tracer Pengguna Lulusan');
      }).catch(() => setError('Gagal mengambil data'))
        .finally(() => setLoading(false));
    } else if (jenis === 'mahasiswa') {
      fetch(`${BASE_URL}/kepuasan-pengguna/${jenis}${qs}`)
        .then(res => res.json())
        .then(result => {
          if (result.success) {
            setKepuasan(result.data);
            setPeriodeList(result.periode_list || []);
            setSelectedPeriode(result.periode || '');
          }
          setLabel('Tracer Mahasiswa');
        })
        .catch(() => setError('Gagal mengambil data'))
        .finally(() => setLoading(false));
    } else {
      fetch(`${BASE_URL}/data-survey/${jenis}${qs}`)
        .then(res => res.json())
        .then(result => {
          if (result.success) {
            setData(result.data);
            setTotal(result.total);
            setLabel(result.label);
            setPeriodeList(result.periode_list || []);
            setSelectedPeriode(result.periode || '');
          } else {
            setError('Data tidak ditemukan');
          }
        })
        .catch(() => setError('Gagal mengambil data'))
        .finally(() => setLoading(false));
    }
  }, [jenis]);

  // Fetch ulang saat pengunjung ganti periode dari dropdown
  const handleGantiPeriode = (periodeBaru) => {
    setSelectedPeriode(periodeBaru);
    setLoading(true);
    const qs = `?periode=${encodeURIComponent(periodeBaru)}`;

    if (jenis === 'pengguna_lulusan') {
      Promise.all([
        fetch(`${BASE_URL}/referensi-pengguna/${jenis}${qs}`).then(res => res.json()),
        fetch(`${BASE_URL}/kepuasan-pengguna/${jenis}${qs}`).then(res => res.json()),
      ]).then(([refResult, kepResult]) => {
        if (refResult.success) { setReferensi(refResult.data); setTotalReferensi(refResult.total); }
        if (kepResult.success) setKepuasan(kepResult.data);
      }).finally(() => setLoading(false));
    } else if (jenis === 'mahasiswa') {
      fetch(`${BASE_URL}/kepuasan-pengguna/${jenis}${qs}`)
        .then(res => res.json())
        .then(result => { if (result.success) setKepuasan(result.data); })
        .finally(() => setLoading(false));
    } else {
      fetch(`${BASE_URL}/data-survey/${jenis}${qs}`)
        .then(res => res.json())
        .then(result => { if (result.success) { setData(result.data); setTotal(result.total); } })
        .finally(() => setLoading(false));
    }
  };

  const chartDataLulusan = data.map(item => ({
    name: item.tahun_lulus,
    'Jumlah Lulusan': item.jumlah_lulusan,
    'Jumlah Terlacak': item.jumlah_terlacak,
    'Dipesan Sebelum Lulus': item.dipesan_sebelum_lulus,
  }));

  const chartReferensi = referensi.map(item => ({
    name: item.tahun_lulus,
    'Jumlah Lulusan': item.jumlah_lulusan,
    'Jumlah Tanggapan Terlacak': item.jumlah_terlacak,
  }));

  const chartKepuasan = kepuasan.map(item => ({
    name: item.jenis_kemampuan,
    'Sangat Baik': item.sangat_baik,
    'Baik': item.baik,
    'Cukup': item.cukup,
    'Kurang': item.kurang,
  }));

  if (loading && !selectedPeriode) return <Spinner />;

  if (error) return (
    <div style={{ padding: '80px 24px', textAlign: 'center' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
      <p style={{ color: '#718096' }}>{error}</p>
      <button onClick={() => navigate('/tracer-study')} className="btn-primary" style={{ marginTop: '16px' }}>
        ← Kembali ke Tracer Study
      </button>
    </div>
  );

  const renderPeriodeSelector = () => (
    periodeList.length > 0 && (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <label style={{ fontSize: '14px', fontWeight: 600, color: '#1a3a5c' }}>📅 Periode Survey:</label>
        <select
          value={selectedPeriode}
          onChange={(e) => handleGantiPeriode(e.target.value)}
          style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', fontWeight: 600, color: '#1a3a5c' }}
        >
          {periodeList.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
    )
  );

  const renderKepuasanBlock = () => (
    <>
      <div className="card" style={{ marginBottom: '32px', overflowX: 'auto' }}>
        <h2 style={{ fontSize: '16px', marginBottom: '16px', color: '#1a3a5c' }}>
          📋 Tingkat Kepuasan per Aspek
        </h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#1a3a5c', color: 'white' }}>
              <th style={{ padding: '10px 12px', textAlign: 'left' }}>Aspek</th>
              <th style={{ padding: '10px 12px', textAlign: 'center' }}>Sangat Baik</th>
              <th style={{ padding: '10px 12px', textAlign: 'center' }}>Baik</th>
              <th style={{ padding: '10px 12px', textAlign: 'center' }}>Cukup</th>
              <th style={{ padding: '10px 12px', textAlign: 'center' }}>Kurang</th>
            </tr>
          </thead>
          <tbody>
            {kepuasan.map((item, index) => (
              <tr key={item.id} style={{ background: index % 2 === 0 ? 'white' : '#f7f9fc' }}>
                <td style={{ padding: '10px 12px' }}>{item.jenis_kemampuan}</td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}>{item.sangat_baik}%</td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}>{item.baik}%</td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}>{item.cukup}%</td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}>{item.kurang}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '16px', marginBottom: '20px', color: '#1a3a5c' }}>
          📊 Diagram Tingkat Kepuasan
        </h2>
        <ResponsiveContainer width="100%" height={380}>
          <BarChart data={chartKepuasan} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} unit="%" />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={180} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Sangat Baik" stackId="a" fill="#2ecc71" />
            <Bar dataKey="Baik" stackId="a" fill="#3498db" />
            <Bar dataKey="Cukup" stackId="a" fill="#f59e0b" />
            <Bar dataKey="Kurang" stackId="a" fill="#e53e3e" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );

  return (
    <div>
      <div style={{
        background: 'linear-gradient(135deg, #1a3a5c 0%, #0f2540 100%)',
        padding: '48px 24px',
        textAlign: 'center',
        color: 'white'
      }}>
        <h1 style={{ color: 'white', marginBottom: '8px' }}>Hasil Survey</h1>
        <p style={{ color: 'rgba(255,255,255,0.75)' }}>{label}</p>
      </div>

      <Breadcrumb items={[
        { label: 'Beranda', url: '/' },
        { label: 'Tracer Study', url: '/tracer-study' },
        { label: `Hasil Survey — ${label}` },
      ]} />

      <div className="page-content">
        {renderPeriodeSelector()}

        {jenis === 'pengguna_lulusan' ? (
          referensi.length === 0 && kepuasan.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#718096' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
              <p>Belum ada data hasil survey untuk jenis tracer ini.</p>
              <button onClick={() => navigate('/tracer-study')} className="btn-secondary" style={{ marginTop: '16px' }}>
                ← Kembali ke Tracer Study
              </button>
            </div>
          ) : (
            <>
              {referensi.length > 0 && (
                <div className="card" style={{ marginBottom: '32px', overflowX: 'auto' }}>
                  <h2 style={{ fontSize: '16px', marginBottom: '16px', color: '#1a3a5c' }}>
                    📋 Jumlah Lulusan & Tanggapan Kepuasan Terlacak
                  </h2>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ background: '#1a3a5c', color: 'white' }}>
                        <th style={{ padding: '10px 12px', textAlign: 'center' }}>Tahun Lulus</th>
                        <th style={{ padding: '10px 12px', textAlign: 'center' }}>Jumlah Lulusan</th>
                        <th style={{ padding: '10px 12px', textAlign: 'center' }}>Jumlah Tanggapan Terlacak</th>
                      </tr>
                    </thead>
                    <tbody>
                      {referensi.map((item, index) => (
                        <tr key={item.id} style={{ background: index % 2 === 0 ? 'white' : '#f7f9fc' }}>
                          <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 600 }}>{item.tahun_lulus}</td>
                          <td style={{ padding: '10px 12px', textAlign: 'center' }}>{item.jumlah_lulusan}</td>
                          <td style={{ padding: '10px 12px', textAlign: 'center' }}>{item.jumlah_terlacak}</td>
                        </tr>
                      ))}
                      {totalReferensi && (
                        <tr style={{ background: '#ebf8ff', fontWeight: 700 }}>
                          <td style={{ padding: '10px 12px', textAlign: 'center', color: '#1a3a5c' }}>Jumlah</td>
                          <td style={{ padding: '10px 12px', textAlign: 'center', color: '#1a3a5c' }}>{totalReferensi.jumlah_lulusan}</td>
                          <td style={{ padding: '10px 12px', textAlign: 'center', color: '#1a3a5c' }}>{totalReferensi.jumlah_terlacak}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {referensi.length > 0 && (
                <div className="card" style={{ marginBottom: '28px' }}>
                  <h2 style={{ fontSize: '16px', marginBottom: '20px', color: '#1a3a5c' }}>
                    📊 Diagram Jumlah Lulusan & Tanggapan Terlacak
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartReferensi} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Jumlah Lulusan" fill="#1a3a5c" radius={[4,4,0,0]} />
                      <Bar dataKey="Jumlah Tanggapan Terlacak" fill="#2ecc71" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {kepuasan.length > 0 && renderKepuasanBlock()}

              <button onClick={() => navigate('/tracer-study')} className="btn-secondary">
                ← Kembali ke Tracer Study
              </button>
            </>
          )
        ) : jenis === 'mahasiswa' ? (
          kepuasan.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#718096' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
              <p>Belum ada data hasil survey untuk jenis tracer ini.</p>
              <button onClick={() => navigate('/tracer-study')} className="btn-secondary" style={{ marginTop: '16px' }}>
                ← Kembali ke Tracer Study
              </button>
            </div>
          ) : (
            <>
              {renderKepuasanBlock()}
              <button onClick={() => navigate('/tracer-study')} className="btn-secondary">
                ← Kembali ke Tracer Study
              </button>
            </>
          )
        ) : (
          data.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#718096' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
              <p>Belum ada data hasil survey untuk jenis tracer ini.</p>
              <button onClick={() => navigate('/tracer-study')} className="btn-secondary" style={{ marginTop: '16px' }}>
                ← Kembali ke Tracer Study
              </button>
            </div>
          ) : (
            <>
              <div className="card" style={{ marginBottom: '32px', overflowX: 'auto' }}>
                <h2 style={{ fontSize: '16px', marginBottom: '16px', color: '#1a3a5c' }}>
                  📋 Tabel Rekap Data Survey
                </h2>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: '#1a3a5c', color: 'white' }}>
                      <th style={{ padding: '10px 12px', textAlign: 'center' }} rowSpan="2">Tahun Lulus</th>
                      <th style={{ padding: '10px 12px', textAlign: 'center' }} rowSpan="2">Jumlah Lulusan</th>
                      <th style={{ padding: '10px 12px', textAlign: 'center' }} rowSpan="2">Jumlah Terlacak</th>
                      <th style={{ padding: '10px 12px', textAlign: 'center' }} rowSpan="2">Dipesan Sebelum Lulus</th>
                      <th style={{ padding: '10px 12px', textAlign: 'center' }} colSpan="3">Waktu Tunggu Mendapatkan Pekerjaan</th>
                    </tr>
                    <tr style={{ background: '#2d5986', color: 'white' }}>
                      <th style={{ padding: '8px 12px', textAlign: 'center' }}>WT &lt; 6 Bulan</th>
                      <th style={{ padding: '8px 12px', textAlign: 'center' }}>6 ≤ WT ≤ 18 Bulan</th>
                      <th style={{ padding: '8px 12px', textAlign: 'center' }}>WT &gt; 18 Bulan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr key={item.id} style={{ background: index % 2 === 0 ? 'white' : '#f7f9fc' }}>
                        <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 600 }}>{item.tahun_lulus}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>{item.jumlah_lulusan}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>{item.jumlah_terlacak}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>{item.dipesan_sebelum_lulus}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>{item.wt_kurang_6_bulan}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>{item.wt_6_18_bulan}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>{item.wt_lebih_18_bulan}</td>
                      </tr>
                    ))}
                    {total && (
                      <tr style={{ background: '#ebf8ff', fontWeight: 700 }}>
                        <td style={{ padding: '10px 12px', textAlign: 'center', color: '#1a3a5c' }}>Jumlah</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center', color: '#1a3a5c' }}>{total.jumlah_lulusan}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center', color: '#1a3a5c' }}>{total.jumlah_terlacak}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center', color: '#1a3a5c' }}>{total.dipesan_sebelum_lulus}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center', color: '#1a3a5c' }}>{total.wt_kurang_6_bulan}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center', color: '#1a3a5c' }}>{total.wt_6_18_bulan}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center', color: '#1a3a5c' }}>{total.wt_lebih_18_bulan}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="card" style={{ marginBottom: '28px' }}>
                <h2 style={{ fontSize: '16px', marginBottom: '20px', color: '#1a3a5c' }}>
                  📊 Diagram Jumlah Lulusan & Keterlacakan
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartDataLulusan} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Jumlah Lulusan" fill="#1a3a5c" radius={[4,4,0,0]} />
                    <Bar dataKey="Jumlah Terlacak" fill="#2ecc71" radius={[4,4,0,0]} />
                    <Bar dataKey="Dipesan Sebelum Lulus" fill="#f59e0b" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="card" style={{ marginBottom: '28px' }}>
                <h2 style={{ fontSize: '16px', marginBottom: '20px', color: '#1a3a5c' }}>
                  ⏱️ Proporsi Waktu Tunggu Mendapatkan Pekerjaan
                </h2>
                {total && (
                  <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'WT < 6 Bulan', value: total.wt_kurang_6_bulan },
                          { name: '6 ≤ WT ≤ 18 Bulan', value: total.wt_6_18_bulan },
                          { name: 'WT > 18 Bulan', value: total.wt_lebih_18_bulan },
                        ]}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={110}
                        paddingAngle={2}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        <Cell fill="#2ecc71" />
                        <Cell fill="#f59e0b" />
                        <Cell fill="#e53e3e" />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              <button onClick={() => navigate('/tracer-study')} className="btn-secondary">
                ← Kembali ke Tracer Study
              </button>
            </>
          )
        )}
      </div>
    </div>
  );
}

export default HasilSurvey;
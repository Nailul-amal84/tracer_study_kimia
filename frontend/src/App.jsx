import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import FAQ from './pages/FAQ';
import LaporanSaran from './pages/LaporanSaran';
import Tentang from './pages/Tentang';
import ProfilAlumni from './pages/ProfilAlumni';
import Informasi from './pages/informasi';
import DetailArtikel from './pages/detailartikel';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import KelolaFaq from './pages/admin/KelolaFaq';
import KelolaArtikel from './pages/admin/KelolaArtikel';
import KelolaProfilAlumni from './pages/admin/KelolaProfilAlumni';
import KelolaTentang from './pages/admin/KelolaTentang';
import KelolaTracerStudy from './pages/admin/KelolaTracerStudy';
import LihatPesan from './pages/admin/LihatPesan';
import TracerStudy from './pages/TracerStudy';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman Publik (dengan Navbar) */}
        <Route path="/" element={<><Navbar /><Home /></>} />
        <Route path="/faq" element={<><Navbar /><FAQ /></>} />
        <Route path="/laporan-saran" element={<><Navbar /><LaporanSaran /></>} />
        <Route path="/tentang/:jenis" element={<><Navbar /><Tentang /></>} />
        <Route path="/profil-alumni" element={<><Navbar /><ProfilAlumni /></>} />
        <Route path="/informasi" element={<><Navbar /><Informasi /></>} />
        <Route path="/informasi/:id" element={<><Navbar /><DetailArtikel /></>} />
        <Route path="/tracer-study" element={<><Navbar /><TracerStudy /></>} />

        {/* Halaman Admin (tanpa Navbar publik) */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/faq" element={<KelolaFaq />} />
        <Route path="/admin/artikel" element={<KelolaArtikel />} />
        <Route path="/admin/profil-alumni" element={<KelolaProfilAlumni />} />
        <Route path="/admin/tentang" element={<KelolaTentang />} />
        <Route path="/admin/tracer-study" element={<KelolaTracerStudy />} />
        <Route path="/admin/laporan-saran" element={<LihatPesan />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
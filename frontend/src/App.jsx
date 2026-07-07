import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import FAQ from './pages/FAQ';
import LaporanSaran from './pages/LaporanSaran';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/laporan-saran" element={<LaporanSaran />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <Link to="/">Beranda</Link>
      {' | '}
      <Link to="/faq">FAQ</Link>
      {' | '}
      <Link to="/laporan-saran">Laporan & Saran</Link>
      {' | '}
      <Link to="/tentang/struktur-organisasi">Struktur Organisasi</Link>
      {' | '}
      <Link to="/tentang/surveyor">Surveyor</Link>
      {' | '}
      <Link to="/tentang/peneliti">Peneliti</Link>
    </nav>
  );
}

export default Navbar;
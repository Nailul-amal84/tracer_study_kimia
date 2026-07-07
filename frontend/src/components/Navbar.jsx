import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <Link to="/">Beranda</Link>
      {' | '}
      <Link to="/faq">FAQ</Link>
    </nav>
  );
}

export default Navbar;
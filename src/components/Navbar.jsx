import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="flex justify-around p-4 bg-gray-900 sticky top-0 z-10">
      <Link to="/" className="text-blue-400 hover:text-blue-300 transition duration-200">Create Deal</Link>
      <Link to="/history" className="text-blue-400 hover:text-blue-300 transition duration-200">History</Link>
      <Link to="/profile" className="text-blue-400 hover:text-blue-300 transition duration-200">Profile</Link>
    </nav>
  );
}

export default Navbar;
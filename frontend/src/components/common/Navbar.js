import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Avatar } from './UI';

export default function Navbar() {
  const { user, logout, isDoctor } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const accent = isDoctor ? 'teal' : 'blue';
  const dashPath = isDoctor ? '/doctor/dashboard' : '/patient/dashboard';

  const isActive = (path) => location.pathname === path;
  const navLinkClass = (path) =>
    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
      isActive(path)
        ? isDoctor ? 'bg-teal-50 text-teal-700' : 'bg-blue-50 text-blue-700'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDoctor && user ? 'bg-teal-600' : 'bg-blue-600'}`}>
            <span className="text-white text-lg">❤</span>
          </div>
          <span className="font-black text-lg text-gray-900 tracking-tight">
            Medi<span className={isDoctor && user ? 'text-teal-600' : 'text-blue-600'}>Care+</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {!user && (
            <>
              <Link to="/"         className={navLinkClass('/')}>🏠 Home</Link>
              <Link to="/doctors"  className={navLinkClass('/doctors')}>👨‍⚕️ Doctors</Link>
              <Link to="/about"    className={navLinkClass('/about')}>ℹ About</Link>
            </>
          )}
          {user && (
            <Link to={dashPath} className={navLinkClass(dashPath)}>
              📊 Dashboard
            </Link>
          )}
        </div>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200">
                <Avatar name={user.name} size="sm" color={isDoctor ? 'teal' : 'blue'} />
                <div>
                  <div className="text-sm font-semibold text-gray-800 leading-none">{user.name.split(' ')[0]}</div>
                  <div className="text-xs text-gray-400 capitalize leading-tight">{user.role}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 border border-gray-200 hover:border-blue-400 hover:text-blue-600 transition-all no-underline">
                Log In
              </Link>
              <Link to="/register" className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all no-underline">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-5 pb-5 pt-3 space-y-1">
          {!user && (
            <>
              <Link to="/"        onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-3 border-b border-gray-100 text-gray-700 font-medium no-underline">🏠 Home</Link>
              <Link to="/doctors" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-3 border-b border-gray-100 text-gray-700 font-medium no-underline">👨‍⚕️ Doctors</Link>
              <Link to="/about"   onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-3 border-b border-gray-100 text-gray-700 font-medium no-underline">ℹ About</Link>
            </>
          )}
          {user && (
            <Link to={dashPath} onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-3 border-b border-gray-100 text-gray-700 font-medium no-underline">📊 Dashboard</Link>
          )}
          <div className="flex gap-3 pt-3">
            {user ? (
              <button onClick={handleLogout} className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-semibold text-sm">Logout</button>
            ) : (
              <>
                <Link to="/login"    onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm no-underline">Log In</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm no-underline">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

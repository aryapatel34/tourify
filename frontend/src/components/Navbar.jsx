import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Search } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          Tourify
        </Link>
        <div className="navbar-search">
          <Search size={18} color="var(--color-text-light)" />
          <input 
            className="navbar-search-input" 
            placeholder="Search itineraries..." 
            type="text"
          />
        </div>
      </div>
      
      <div className="navbar-right">
        {user ? (
          <>
            <div className="navbar-links">
              <Link to="/dashboard" className={`navbar-link ${isActive('/dashboard')}`}>
                My Trips
              </Link>
              <Link to="/upload" className={`navbar-link ${isActive('/upload')}`}>
                Upload
              </Link>
              <Link to="/profile" className={`navbar-link ${isActive('/profile')}`}>
                Profile
              </Link>
              <button 
                onClick={handleLogout} 
                className="navbar-link" 
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit', padding: 0 }}
              >
                Logout
              </button>
            </div>
            <button onClick={() => navigate('/upload')} className="navbar-btn">
              Plan New Trip
            </button>
          </>
        ) : (
          <>
            <div className="navbar-links">
              <Link to="/login" className="navbar-link">
                Login
              </Link>
            </div>
            <Link to="/register" className="navbar-btn" style={{ textDecoration: 'none' }}>
              Sign Up
            </Link>
          </>
        )}

        <button 
          className="navbar-mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="mobile-menu" style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--color-white)', padding: '16px', boxShadow: 'var(--shadow-md)' }}>
          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>My Trips</Link>
              <Link to="/upload" onClick={() => setIsMobileMenuOpen(false)}>Upload Bookings</Link>
              <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link>
              <button onClick={handleLogout} style={{ textAlign: 'left' }}>Logout</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;

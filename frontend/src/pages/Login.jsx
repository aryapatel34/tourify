import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, Sparkles } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        {/* Left Side - Hero */}
        <div className="login-hero">
          <div className="login-hero-content">
            <h1 className="login-hero-title">
              Discover your next<br />adventure with Tourify.
            </h1>
            <p className="login-hero-subtitle">
              Experience intelligent travel planning that adapts to your curiosity. Secure, seamless, and inspired by the world's most beautiful destinations.
            </p>
            <div className="login-hero-card">
              <div className="login-hero-icon">
                <Sparkles size={24} color="#003d9b" />
              </div>
              <div className="login-hero-card-text">
                <div className="login-hero-card-title">AI-Powered Insights</div>
                <div className="login-hero-card-desc">Generating personalized itineraries in seconds...</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="login-form-wrapper">
          <div className="login-form-inner">
            <div className="login-logo">
              <Compass size={28} strokeWidth={2.5} />
              <span>Tourify</span>
            </div>

            <h2 className="login-title">Welcome Back</h2>
            <p className="login-subtitle">Please enter your details to sign in.</p>

            <div className="login-tabs">
              <Link to="/login" className="login-tab active" style={{ textDecoration: 'none' }}>Sign In</Link>
              <Link to="/register" className="login-tab" style={{ textDecoration: 'none' }}>Create Account</Link>
            </div>

            {error && <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <div className="form-label-row">
                  <label className="form-label" htmlFor="email">Email Address</label>
                </div>
                <input
                  className="form-input"
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <div className="form-label-row">
                  <label className="form-label" htmlFor="password">Password</label>
                  <a href="#" className="form-forgot">Forgot password?</a>
                </div>
                <input
                  className="form-input"
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="login-btn-primary" disabled={loading}>
                {loading ? 'Processing...' : 'Sign In'}
              </button>
            </form>

            <div className="login-divider">
              <span>OR CONTINUE WITH</span>
            </div>

            <div className="login-social-btns">
              <button className="login-btn-social" type="button">
                <img 
                  src="https://www.svgrepo.com/show/475656/google-color.svg" 
                  alt="Google" 
                  width="18" 
                  height="18" 
                />
                Google
              </button>
              <button className="login-btn-social" type="button">
                <svg viewBox="0 0 384 512" width="18" height="18" fill="currentColor">
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                </svg>
                Apple
              </button>
            </div>

            <div className="login-help">
              Need help? <a href="#">Visit our Support Center</a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="login-footer">
        <div className="login-footer-logo">
          <Compass size={20} strokeWidth={2.5} />
          <span>Tourify</span>
        </div>
        <div className="login-footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Help Center</a>
          <a href="#">Cookies</a>
        </div>
        <div className="login-footer-copy">
          © 2024 Tourify AI Travel Companion. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Login;

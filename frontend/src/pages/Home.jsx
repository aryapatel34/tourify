import { Link } from 'react-router-dom';
import { Compass, Sparkles, Plane, Hotel, FileText, Calendar, Map, MoveRight, Globe, Mail } from 'lucide-react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <main className="home-main">
        
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-bg"></div>
          <div className="hero-bg-gradient"></div>
          
          <div className="hero-content">
            <div className="hero-tag">AI-POWERED TRAVEL AGENT</div>
            <h1 className="hero-title">
              Your AI Travel Assistant – From Booking to Itinerary in Seconds
            </h1>
            <p className="hero-subtitle">
              Simplify your journey. Upload your bookings and let our intelligent engine craft a seamless, personalized itinerary tailored to your travel style.
            </p>
            <div className="hero-actions">
              <Link to="/upload" className="btn-primary">
                Get Started <MoveRight size={18} />
              </Link>
              
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="hero-card">
              <div className="hero-card-header">
                <div className="hero-card-icon">
                  <Compass size={20} color="#fff" />
                </div>
                <div>
                  <div className="hero-card-title">Tourify AI</div>
                  <div className="hero-card-subtitle">Analyzing travel documents...</div>
                </div>
              </div>
              
              <div className="hero-progress">
                <div className="progress-bar">
                  <div className="progress-bar-inner" style={{ width: '80%' }}></div>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-inner light" style={{ width: '60%' }}></div>
                </div>
              </div>
              
              <div className="hero-card-grid">
                <div className="hero-card-item">
                  <Plane size={16} className="hero-card-item-icon" />
                  <div>
                    <div className="hero-card-item-text">Flight JP337</div>
                    <div className="hero-card-item-sub">Confirmed • Dec 12</div>
                  </div>
                </div>
                <div className="hero-card-item">
                  <Hotel size={16} className="hero-card-item-icon" style={{ color: '#d97706' }} />
                  <div>
                    <div className="hero-card-item-text">The Grand Kyoto</div>
                    <div className="hero-card-item-sub">Check-in • 14:00</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="how-section">
          <h2 className="section-title">How it Works</h2>
          <p className="section-subtitle">
            We turn your messy travel emails and PDF confirmations into a structured, beautiful plan in three simple steps.
          </p>
          
          <div className="how-grid">
            <div className="how-step">
              <div className="how-icon-box blue">
                <FileText size={24} />
              </div>
              <h3 className="how-step-title">Upload</h3>
              <p className="how-step-desc">
                Forward your confirmation emails or drop your PDF hotel and flight bookings directly into Tourify.
              </p>
            </div>
            
            <MoveRight className="how-arrow arrow-1" size={24} strokeWidth={1.5} />
            
            <div className="how-step">
              <div className="how-icon-box yellow">
                <Sparkles size={24} />
              </div>
              <h3 className="how-step-title">AI Extraction</h3>
              <p className="how-step-desc">
                Our intelligent engine identifies flight times, hotel addresses, and reservation codes with 99% accuracy.
              </p>
            </div>
            
            <MoveRight className="how-arrow arrow-2" size={24} strokeWidth={1.5} />
            
            <div className="how-step">
              <div className="how-icon-box cyan">
                <Calendar size={24} />
              </div>
              <h3 className="how-step-title">Custom Itinerary</h3>
              <p className="how-step-desc">
                Get a chronologically ordered timeline, interactive maps, and local recommendations synced to your calendar.
              </p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <div className="features-grid">
          <div className="feature-large">
            <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop" alt="Beach" />
            <div className="feature-large-content">
              <div className="feature-large-title">Explore Worldwide</div>
              <div className="feature-large-desc">Support for 5,000+ airlines and 1M+ hotels globally.</div>
            </div>
          </div>
          
          <div className="feature-small-grid">
            <div className="feature-smart">
              <div className="feature-smart-title">Smart Mapping</div>
              <div className="feature-smart-desc">Real-time travel updates and distance calculations between all your stops.</div>
              <div className="feature-smart-tags">
                <div className="feature-smart-tag">Live Sync</div>
                <div className="feature-smart-tag">Offline Mode</div>
              </div>
            </div>
            
            <div className="feature-stats">
              <Sparkles size={32} className="feature-stats-icon" />
              <div className="feature-stats-title">150k+</div>
              <div className="feature-stats-desc">Trips Planned</div>
            </div>
            
            <div className="feature-users">
              <div className="feature-users-avatars">
                <div className="feature-users-avatar"></div>
                <div className="feature-users-avatar"></div>
                <div className="feature-users-avatar"></div>
              </div>
              <div className="feature-users-title">Trusted by Explorers</div>
              <div className="feature-users-desc">Join our global community of smart travelers.</div>
            </div>
          </div>
        </div>

        {/* Ready Banner */}
        <div className="ready-banner">
          <h2 className="ready-title">Ready to Simplify Your Next Trip?</h2>
          <p className="ready-desc">Get your AI-crafted itinerary in under 60 seconds. No credit card required.</p>
          <Link to="/upload" className="ready-btn">Create Your Trip Now</Link>
        </div>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-left">
            <div className="footer-logo">
              <Compass size={24} color="var(--color-text-main)" strokeWidth={2.5} />
              <span>Tourify</span>
            </div>
            <div className="footer-copy">© 2024 Tourify AI Travel Companion. All rights reserved.</div>
          </div>
          
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Help Center</a>
            <a href="#">Cookies</a>
          </div>
          
          <div className="footer-social">
            <Globe size={20} />
            <Mail size={20} />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

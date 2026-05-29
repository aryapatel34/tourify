import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Sparkles, MoveRight, Calendar, MoreVertical, RotateCcw, Upload, Compass, Globe, Mail, Map as MapIcon, Trash2 } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['itineraries'],
    queryFn: () => fetchClient('/itinerary'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => fetchClient(`/itinerary/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itineraries'] });
    },
    onError: (err) => {
      alert(err.message || 'Failed to delete itinerary');
    }
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this itinerary?')) {
      deleteMutation.mutate(id);
    }
  };

  const itineraries = data?.itineraries || [];

  return (
    <div className="dashboard-container">
      <main className="dashboard-main">

        {/* Header */}
        <div className="dashboard-header">
          <div className="dashboard-header-text">
            <h1 className="dashboard-title">My Trips</h1>
            <p className="dashboard-subtitle">
              Organize your adventures, relive past memories, and let AI help you discover your next destination.
            </p>
          </div>
          <Link to="/upload" className="btn-upload" style={{ textDecoration: 'none' }}>
            <Upload size={18} /> Upload Bookings
          </Link>
        </div>

        <div className="dashboard-grid">

          {/* Left Column */}
          <div className="dashboard-sidebar">
            <div className="ai-assistant-card">
              <div className="ai-tag">
                <Sparkles size={16} /> AI TRAVEL ASSISTANT
              </div>
              <h2 className="ai-title">Where to next, {user?.name?.split(' ')[0] || 'Traveler'}?</h2>
              <p className="ai-desc">
                Based on your love for Mediterranean sunsets and boutique stays, I've found three hidden gems in Amalfi.
              </p>
              <div className="ai-divider"></div>
              <button className="btn-generate" onClick={() => navigate('/upload')}>
                Generate New Plan <MoveRight size={16} />
              </button>
            </div>

            <div className="stats-card">
              <div className="stats-title">ADVENTURE STATS</div>
              <div className="stats-grid">
                <div className="stat-box">
                  <div className="stat-number">12</div>
                  <div className="stat-label">Countries</div>
                </div>
                <div className="stat-box">
                  <div className="stat-number">{itineraries.length > 0 ? 34 + itineraries.length : 34}</div>
                  <div className="stat-label">Trips</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="dashboard-content">

            {/* Upcoming Adventures */}
            <section>
              <div className="section-header">
                <h2 className="section-title">Upcoming Adventures</h2>
                <div className="section-badge">{itineraries.length}</div>
              </div>

              {isLoading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  Loading your itineraries...
                </div>
              ) : error ? (
                <div style={{ padding: '20px', color: 'red', backgroundColor: '#ffe6e6', borderRadius: 'var(--radius-md)' }}>
                  Error loading itineraries: {error.message}
                </div>
              ) : itineraries.length === 0 ? (
                <div style={{ padding: '60px 40px', textAlign: 'center', backgroundColor: 'var(--color-white)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border-light)' }}>
                  <MapIcon size={48} color="var(--color-text-light)" style={{ marginBottom: '16px' }} />
                  <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>No itineraries yet</h3>
                  <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>Upload your travel documents to generate your first AI itinerary.</p>
                  <Link to="/upload" className="btn-upload" style={{ textDecoration: 'none', display: 'inline-flex', background: 'var(--color-primary)', color: 'white' }}>
                    Get Started
                  </Link>
                </div>
              ) : (
                <div className="trips-grid">
                  {itineraries.map((itinerary, i) => (
                    <div className="trip-card" key={itinerary._id}>
                      <div className="trip-image-wrap">
                        <img
                          src={i % 2 === 0 ? "https://images.unsplash.com/photo-1533676802871-eca1ae998cd5?q=80&w=2070&auto=format&fit=crop" : "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=2070&auto=format&fit=crop"}
                          alt={itinerary.title}
                          className="trip-image"
                        />
                        <div className="trip-status-tag">Planned</div>
                      </div>
                      <div className="trip-card-content">
                        <h3 className="trip-card-title">{itinerary.title}</h3>
                        <div className="trip-card-date">
                          <Calendar size={14} /> {itinerary.generatedContent?.destination || 'Destination'}
                        </div>
                        <div className="trip-actions">
                          <Link to={`/itinerary/${itinerary._id}`} className="btn-view" style={{ textDecoration: 'none', display: 'block' }}>
                            View Itinerary
                          </Link>
                          <button
                            className="btn-more"
                            style={{ color: 'red', borderColor: '#ffcdd2', backgroundColor: '#ffebee' }}
                            onClick={() => handleDelete(itinerary._id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>



          </div>
        </div>
      </main>

      {/* Footer */}
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

export default Dashboard;

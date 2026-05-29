import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchClient } from '../api/client';
import { Sparkles, Map, MapPin, Share, FileText, ChevronRight, Sun, Banknote } from 'lucide-react';
import './ItineraryDetails.css';

const ItineraryDetails = () => {
  const { id } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['itinerary', id],
    queryFn: () => fetchClient(`/api/itinerary/${id}`),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="itinerary-container" style={{ padding: '100px', textAlign: 'center' }}>
        <Sparkles size={32} className="spin" color="var(--color-primary)" style={{ margin: '0 auto 24px' }} />
        <h2>Loading your itinerary...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="itinerary-container" style={{ padding: '100px', textAlign: 'center', color: 'red' }}>
        <h2>Error loading itinerary</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  const itinerary = data?.itinerary;
  const content = itinerary?.generatedContent || {};
  const destination = content.destination || 'Unknown Destination';
  const days = content.days || content.dailyPlan || [];

  return (
    <div className="itinerary-container">
      <main className="itinerary-main">
        <div className="itinerary-grid">
          
          {/* Left Column (Timeline) */}
          <div className="itinerary-left">
            <div className="itinerary-tag">
              <Sparkles size={16} /> AI GENERATED ITINERARY
            </div>
            
            <div className="itinerary-header">
              <div>
                <h1 className="itinerary-title">{itinerary?.title || `Trip to ${destination}`}</h1>
                <p className="itinerary-subtitle">{days.length} Days • Premium Experience</p>
              </div>
              <div className="itinerary-actions">
                <button className="btn-share"><Share size={16} /> Share</button>
                <button className="btn-pdf"><FileText size={16} /> PDF</button>
              </div>
            </div>

            <div className="refining-card">
              <div className="refining-icon">
                <Sparkles size={24} />
              </div>
              <div className="refining-info">
                <div className="refining-text">
                  <span>Tourify AI: Itinerary Ready</span>
                  <span>100% Complete</span>
                </div>
                <div className="refining-bar">
                  <div className="refining-bar-inner" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>

            <div className="timeline">
              {days.length > 0 ? days.map((day, index) => (
                <div className="day-block" key={index}>
                  <div className={`day-marker ${index % 2 === 1 ? 'blue' : ''}`}></div>
                  <div className="day-header">
                    <h2 className="day-title">Day {index + 1}: {day.theme || 'Exploration'}</h2>
                    <p className="day-subtitle">{day.date || `Day ${index + 1}`}</p>
                  </div>
                  
                  <div className="day-content">
                    {/* Render Activities for the day (Dynamic) */}
                    {day.activities && day.activities.length > 0 ? (
                      day.activities.map((activity, actIndex) => (
                         <div className="timeline-card ai-choice-card" key={actIndex} style={{ marginBottom: '16px' }}>
                           <div className="ai-choice-bg"></div>
                           <div className="ai-choice-content">
                             <div className="ai-choice-icon">
                               <Sparkles size={20} />
                             </div>
                             <div className="ai-choice-info">
                               <div className="ai-choice-tag">
                                 <Sparkles size={10} /> ACTIVITY
                               </div>
                               <div className="ai-choice-title">{activity.time || ''} {activity.title || activity.name || activity}</div>
                               <div className="ai-choice-desc">
                                 {activity.description || 'Enjoy this AI-recommended activity.'}
                               </div>
                               <div className="ai-choice-actions">
                                 <button 
                                   className="btn-book"
                                   onClick={() => {
                                     const activityName = activity.title || activity.name || activity;
                                     const searchQuery = `${activityName} ${destination}`;
                                     window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
                                   }}
                                 >
                                   Explore
                                 </button>
                               </div>
                             </div>
                           </div>
                         </div>
                      ))
                    ) : (
                      /* Fallback Static Cards for Day 1 style if no dynamic activities structure matches perfectly */
                      <>
                        <div className="timeline-card flight-card">
                          <div className="flight-icon-box">
                            <span className="material-symbols-outlined">flight_land</span>
                          </div>
                          <div className="flight-details">
                            <div className="flight-col">
                              <span className="flight-label">ARRIVAL</span>
                              <span className="flight-value">{destination}</span>
                            </div>
                            <div className="flight-col">
                              <span className="flight-label">STATUS</span>
                              <span className="flight-value warning">Confirmed</span>
                            </div>
                          </div>
                          <div className="flight-action">
                            View Tickets
                          </div>
                        </div>

                        <div className="timeline-card hotel-card">
                          <img src="https://images.unsplash.com/photo-1542051812-87042502699e?q=80&w=2070&auto=format&fit=crop" alt="Hotel" className="hotel-image" />
                          <div className="hotel-tag">Check-in Time</div>
                          <div className="hotel-info">
                            <div>
                              <div className="hotel-name">Recommended Hotel</div>
                              <div className="hotel-loc">{destination}</div>
                            </div>
                            <div className="hotel-rating">
                              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>star</span> 5.0
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )) : (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  No days found in this itinerary.
                </div>
              )}
            </div>
          </div>

          {/* Right Column (Map & Tips) */}
          <div className="itinerary-right">
            
            {/* Map Card */}
            <div className="map-card">
              <div className="map-header">
                <div className="map-title"><Map size={18} /> Live Trip Map</div>
                <div className="map-link">Full Screen</div>
              </div>
              <div className="map-image-area">
                <div className="map-overlay">
                  <div className="map-marker-tag">Destination</div>
                  <MapPin size={40} className="map-pin" strokeWidth={1.5} />
                  <div className="map-text">{destination}</div>
                  <div className="map-subtext">Interactive map tracking your daily route...</div>
                </div>
              </div>
              <div className="map-footer">
                <div className="map-stat">
                  <Sun size={20} className="map-stat-icon" />
                  <div className="map-stat-text">
                    <span className="map-stat-label">FORECAST</span>
                    <span className="map-stat-value">Clear</span>
                  </div>
                </div>
                <div className="map-stat">
                  <Banknote size={20} className="map-stat-icon money" />
                  <div className="map-stat-text">
                    <span className="map-stat-label">EST. DAILY</span>
                    <span className="map-stat-value">Varies</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tip Card */}
            <div className="tip-card">
              <div className="tip-title">
                <Sparkles size={16} /> Tourify AI Tip
              </div>
              <div className="tip-desc">
                Make sure to check local travel advisories and weather conditions before you head to {destination}. AI suggests booking major attractions at least 48h in advance.
              </div>
              <button className="btn-add">Acknowledge</button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default ItineraryDetails;

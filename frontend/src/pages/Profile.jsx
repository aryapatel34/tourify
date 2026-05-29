import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUserProfile, updateUserProfile } from '../api/userApi';
import SiteFooter from '../components/SiteFooter';
import { User, Shield, Bell, Link as LinkIcon, Settings, Edit2, CheckCircle } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
  });

  useEffect(() => {
    if (data?.user) {
      setFormData({
        firstName: data.user.firstName || '',
        lastName: data.user.lastName || '',
        email: data.user.email || '',
        phone: data.user.phone || '',
        bio: data.user.bio || '',
      });
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(['userProfile'], data);
      alert('Profile updated successfully!');
    },
    onError: (err) => {
      alert(`Error updating profile: ${err.message}`);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="profile-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <h2>Loading profile...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container" style={{ justifyContent: 'center', alignItems: 'center', color: 'red' }}>
        <h2>Error: {error.message}</h2>
      </div>
    );
  }

  const user = data?.user || {};
  const displayName = user.firstName || user.lastName 
    ? `${user.firstName} ${user.lastName}`.trim() 
    : user.name || 'Your Name';
    
  const joinedDate = user.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) 
    : 'Unknown';

  return (
    <>
      <div className="profile-container">
        
        {/* Sidebar */}
        <aside className="profile-sidebar">
          <nav className="sidebar-nav">
            <div className="sidebar-link active">
              <User size={18} />
              Personal Info
            </div>
            <div className="sidebar-link">
              <Shield size={18} />
              Security
            </div>
            <div className="sidebar-link">
              <Bell size={18} />
              Notifications
            </div>
            <div className="sidebar-link">
              <LinkIcon size={18} />
              Linked Accounts
            </div>
            <div className="sidebar-link">
              <Settings size={18} />
              General
            </div>
          </nav>

          <div className="ai-assistant-card">
            <h3>AI Travel Assistant</h3>
            <p>Get personalized itineraries based on your profile.</p>
            <div className="ai-progress-bar">
              <div className="ai-progress-fill"></div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="profile-main">
          
          <div className="profile-header">
            <div>
              <h1>Personal Info</h1>
              <p>Update your photo and personal details here.</p>
            </div>
            <button 
              className="btn-save" 
              onClick={handleSave} 
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          <div className="profile-card">
            <div className="profile-user-info">
              <div className="avatar-wrapper">
                <img 
                  src={user.avatarUrl || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=300&auto=format&fit=crop"} 
                  alt="Avatar" 
                  className="avatar-image" 
                />
                <div className="avatar-edit-btn">
                  <Edit2 size={12} />
                </div>
              </div>
              <div className="user-details">
                <h2>{displayName}</h2>
                <p>{user.location || 'Add Location'} • Joined {joinedDate}</p>
              </div>
            </div>

            <div className="profile-form">
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    name="firstName" 
                    className="form-input" 
                    value={formData.firstName} 
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    name="lastName" 
                    className="form-input" 
                    value={formData.lastName} 
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  className="form-input" 
                  value={formData.email} 
                  onChange={handleChange}
                />
                <div className="verified-badge">
                  <CheckCircle size={14} /> Verified
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  className="form-input" 
                  value={formData.phone} 
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea 
                  id="bio" 
                  name="bio" 
                  className="form-input" 
                  value={formData.bio} 
                  onChange={handleChange}
                  placeholder="Digital nomad with a passion for hidden mountain villages and artisanal coffee shops. Currently exploring the Balkans and documenting AI-optimized travel routes."
                />
              </div>

            </div>
          </div>
          
        </main>
      </div>
      <SiteFooter />
    </>
  );
};

export default Profile;

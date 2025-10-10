import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gradients, colors, shadows, cardStyle, typography } from '../theme';
import { api } from '../api';
import { useAuth } from '../auth';
import Layout from '../components/Layout';

export default function Settings() {
  const { user, logout, setUser } = useAuth();
  const nav = useNavigate();
  const initials = (user?.name || 'User').split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase();

  // Resolve API origin (strip trailing /v1 from VITE_API_BASE)
  const API_ORIGIN = (import.meta.env.VITE_API_BASE || '').replace(/\/?v1\/?$/, '');

  // State for all user fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [profile_image, setProfileImage] = useState('');
  const [gender, setGender] = useState('');
  const [university, setUniversity] = useState('');
  const [department, setDepartment] = useState('');
  const [program, setProgram] = useState('');
  const [year_of_study, setYearOfStudy] = useState('');
  const [research_area, setResearchArea] = useState('');
  const [research_interests, setResearchInterests] = useState('');
  const [publications, setPublications] = useState('');
  const [linkedin_url, setLinkedinUrl] = useState('');
  const [google_scholar_url, setGoogleScholarUrl] = useState('');
  const [orcid_id, setOrcidId] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [error, setError] = useState('');

  // Change Password State
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Load user profile
  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data } = await api.get('/profile');
        if (data) {
          setName(data.name || '');
          setEmail(data.email || '');
          setPhoneNumber(data.phone_number || '');
          // Fetch the profile image as base64 to avoid CORS issues
          let imageUrl = '';
          if (data.profile_image) {
            try {
              const imageResponse = await api.get(`/profile/image/${data.profile_image}`);
              if (imageResponse.data.success) {
                imageUrl = imageResponse.data.data; // This is the base64 data URL
              }
            } catch (imgErr) {
              console.error('Failed to load profile image:', imgErr);
            }
          }
          setProfileImage(imageUrl);
          setGender(data.gender || '');
          setUniversity(data.university || '');
          setDepartment(data.department || '');
          setProgram(data.program || '');
          setYearOfStudy(data.year_of_study || '');
          setResearchArea(data.research_area || '');
          setResearchInterests(data.research_interests || '');
          setPublications(data.publications || '');
          setLinkedinUrl(data.linkedin_url || '');
          setGoogleScholarUrl(data.google_scholar_url || '');
          setOrcidId(data.orcid_id || '');
          setBio(data.bio || '');
          setSkills(data.skills || '');
        }
      } catch (err) {
        setError('Failed to load profile.');
      }
    }
    fetchProfile();
  }, []);

  // Handle profile image upload
  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.match('image.*')) {
      setError('Please select an image file (JPEG, PNG, etc.)');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    try {
      setError('');
      
      // Create form data
      const formData = new FormData();
      formData.append('profile_image', file);

      // Show preview immediately
      const previewUrl = URL.createObjectURL(file);
      setProfileImage(previewUrl);

      // Upload the image
      const response = await api.put('/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Update the profile image URL with the server response
      if (response.data.profile_image) {
        const imageUrl = `${API_ORIGIN}/v1/profile/image/${response.data.profile_image}`;
        setProfileImage(imageUrl);
        
        // Update the global user context so the navbar shows the new image
        setUser({
          ...user,
          profile_image: response.data.profile_image
        });
        
        setSaveMessage('Profile image updated successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setError('Failed to update profile image');
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err.response?.data?.message || 'Failed to upload image');
      if (profile_image && typeof profile_image === 'object' && profile_image.previewUrl) {
        setProfileImage(profile_image.previewUrl);
      }
    }
  };

  // Save profile handler
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaveMessage('');
    setError('');
    
    try {
      const formData = new FormData();
      
      // Add all text fields to formData
      const textFields = {
        name,
        email,
        phone_number,
        gender,
        university,
        department,
        program,
        year_of_study,
        research_area,
        research_interests,
        publications,
        linkedin_url,
        google_scholar_url,
        orcid_id,
        bio,
        skills
      };

      Object.entries(textFields).forEach(([key, value]) => {
        if (value) {
          formData.append(key, value);
        }
      });

      // Add profile image only if it's a File object (newly uploaded)
      if (profile_image instanceof File) {
        formData.append('profile_image', profile_image);
      }

      // Make the API call with formData
      const { data } = await api.put('/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update profile image URL if returned from server
      if (data?.profile_image) {
        setProfileImage(`${API_ORIGIN}/v1/profile/image/${data.profile_image}`);
      }

      // Update the global user context with the updated profile data
      setUser({
        ...user,
        ...data
      });

      setSaveMessage('Profile saved successfully!');
    } catch (err) {
      console.error('Save error:', err);
      setError('Failed to save profile.');
    }
  };

  // Change Password Handler
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage('');
    setPasswordError('');
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      return;
    }
    
    try {
      await api.post('/profile/change-password', {
        oldPassword,
        newPassword,
        confirmPassword
      });
      
      setPasswordMessage('Password updated successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      setTimeout(() => {
        setShowPasswordForm(false);
        setPasswordMessage('');
      }, 2000);
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to update password.');
    }
  };

  return (
    <Layout>
      <div style={{ 
        flexGrow: 1,
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}>
      {/* Enhanced Background decorative elements */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: `radial-gradient(circle at 20% 80%, rgba(13, 148, 136, 0.15) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(249, 115, 22, 0.15) 0%, transparent 50%),
                    radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.08) 0%, transparent 70%)`,
        animation: 'dashboardFloat 25s ease-in-out infinite',
        zIndex: 0
      }} />
      
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '8%',
        width: '220px',
        height: '220px',
        background: `linear-gradient(45deg, ${colors.link}, ${colors.highlight})`,
        borderRadius: '50%',
        opacity: 0.06,
        animation: 'dashboardPulse 8s ease-in-out infinite',
        zIndex: 0
      }} />

      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '12%',
        width: '180px',
        height: '180px',
        background: `linear-gradient(45deg, ${colors.highlight}, ${colors.accent || colors.link})`,
        borderRadius: '50%',
        opacity: 0.04,
        animation: 'dashboardPulse 10s ease-in-out infinite reverse',
        zIndex: 0
      }} />



      {/* Main Content Area */}
      <div style={{ 
        flexGrow: 1, 
        padding: '40px', 
        display: 'flex', 
        flexDirection: 'column', 
        borderTopRightRadius: '16px', 
        borderBottomRightRadius: '16px',
        animation: 'fadeInRight 0.6s ease-out 0.3s both'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '20px',
          animation: 'fadeInDown 0.8s ease-out 0.5s both'
        }}>
          <h2 style={{ 
            ...typography.heading2,
            color: colors.primaryText
          }}>Settings</h2>
          <p style={{ margin: 0, color: colors.secondaryText, fontSize: '0.95rem' }}>Manage your account details, preferences, and security.</p>
        </div>
        
        <div style={{ 
          ...cardStyle,
          animation: 'fadeInUp 0.8s ease-out 0.7s both'
        }}>
          {/* Change Password Section - Moved to Top */}
          <div style={{ marginBottom: '30px' }}>
            <button
              type="button"
              style={{
                ...saveButtonStyle,
                backgroundColor: '#6b7280',
                color: 'white',
                marginBottom: 8,
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '500'
              }}
              onClick={() => setShowPasswordForm(v => !v)}
            >
              Change Password
            </button>
          </div>

          <form onSubmit={handleSaveProfile} className="settings-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 18, maxWidth: 1000 }}>
            {/* Profile Image Section */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              marginBottom: '30px',
              padding: '20px',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}>
              <div 
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: profile_image ? 'transparent' : gradients.primary,
                  margin: '0 auto 15px',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '4px solid #fff',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => document.getElementById('profileImageInput').click()}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                }}
              >
                {profile_image ? (
                  <img 
                    src={profile_image} 
                    alt="Profile" 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '40px',
                    fontWeight: 'bold'
                  }}>
                    {initials}
                  </div>
                )}
              </div>
              <input
                type="file"
                id="profileImageInput"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleProfileImageChange}
              />
              <button
                type="button"
                onClick={() => document.getElementById('profileImageInput').click()}
                style={{
                  background: '#4146C9',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  marginTop: '8px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(13, 148, 136, 0.4)';
                  e.currentTarget.style.background = '#0f766e';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(13, 148, 136, 0.3)';
                  e.currentTarget.style.background = '#4146C9';
                }}
              >
                {profile_image ? 'Change Photo' : 'Upload Photo'}
              </button>
              {saveMessage && <div style={{ color: 'green', marginTop: '8px', fontSize: '14px' }}>{saveMessage}</div>}
              {error && <div style={{ color: 'red', marginTop: '8px', fontSize: '14px' }}>{error}</div>}
            </div>
            {/* Personal Information */}
            <div style={sectionCard}>
              <div style={sectionHeader}>
                <h4 style={sectionTitle}>Personal Information</h4>
                <span style={sectionBadge}>Required</span>
              </div>
              <div className="settings-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
                <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} style={inputStyle} required />
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} required />
                <input type="text" placeholder="Phone Number" value={phone_number} onChange={e => setPhoneNumber(e.target.value)} style={inputStyle} />
                <select value={gender} onChange={e => setGender(e.target.value)} style={{ ...inputStyle, background: 'white' }}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Academic Details */}
            <div style={sectionCard}>
              <div style={sectionHeader}>
                <h4 style={sectionTitle}>Academic Details</h4>
              </div>
              <div className="settings-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
                <input type="text" placeholder="University" value={university} onChange={e => setUniversity(e.target.value)} style={inputStyle} />
                <input type="text" placeholder="Department" value={department} onChange={e => setDepartment(e.target.value)} style={inputStyle} />
                <input type="text" placeholder="Program" value={program} onChange={e => setProgram(e.target.value)} style={inputStyle} />
                <input type="text" placeholder="Year of Study" value={year_of_study} onChange={e => setYearOfStudy(e.target.value)} style={inputStyle} />
              </div>
            </div>

            {/* Research Profile */}
            <div style={sectionCard}>
              <div style={sectionHeader}>
                <h4 style={sectionTitle}>Research Profile</h4>
              </div>
              <div className="settings-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
                <input type="text" placeholder="Research Area" value={research_area} onChange={e => setResearchArea(e.target.value)} style={inputStyle} />
                <input type="text" placeholder="Research Interests" value={research_interests} onChange={e => setResearchInterests(e.target.value)} style={inputStyle} />
                <input type="text" placeholder="Publications" value={publications} onChange={e => setPublications(e.target.value)} style={inputStyle} />
              </div>
            </div>

            {/* Links */}
            <div style={sectionCard}>
              <div style={sectionHeader}>
                <h4 style={sectionTitle}>Links</h4>
              </div>
              <div className="settings-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
                <input type="url" placeholder="LinkedIn URL" value={linkedin_url} onChange={e => setLinkedinUrl(e.target.value)} style={inputStyle} />
                <input type="url" placeholder="Google Scholar URL" value={google_scholar_url} onChange={e => setGoogleScholarUrl(e.target.value)} style={inputStyle} />
                <input type="text" placeholder="ORCID ID" value={orcid_id} onChange={e => setOrcidId(e.target.value)} style={inputStyle} />
              </div>
            </div>

            {/* About You */}
            <div style={{ ...sectionCard, gridColumn: '1 / -1' }}>
              <div style={sectionHeader}>
                <h4 style={sectionTitle}>About You</h4>
              </div>
              <textarea placeholder="Bio" value={bio} onChange={e => setBio(e.target.value)} style={{ ...inputStyle, minHeight: '140px', width: '100%' }} />
              <input type="text" placeholder="Skills (comma-separated)" value={skills} onChange={e => setSkills(e.target.value)} style={inputStyle} />
            </div>
            
            {/* Save Profile Button - Moved to Left Bottom */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-start', 
              marginTop: '20px',
              marginBottom: '20px'
            }}>
              <button type="submit" style={{ 
                ...saveButtonStyle, 
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                Save Profile
              </button>
            </div>
            
            
          </form>
          
          {/* Change Password Popup Modal */}
          {showPasswordForm && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              paddingTop: '80px',
              zIndex: 1000,
              animation: 'fadeIn 0.3s ease-out'
            }}>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '30px',
                maxWidth: '450px',
                width: '90%',
                maxHeight: '80vh',
                overflow: 'auto',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                animation: 'slideDown 0.3s ease-out',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '25px'
                }}>
                  <h3 style={{
                    margin: 0,
                    ...typography.heading3,
                    color: colors.primaryText
                  }}>
                    Change Password
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setOldPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                      setPasswordMessage('');
                      setPasswordError('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '24px',
                      cursor: 'pointer',
                      color: '#6b7280',
                      padding: '4px',
                      borderRadius: '4px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                      e.currentTarget.style.color = '#374151';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#6b7280';
                    }}
                  >
                    ×
                  </button>
                </div>
                
                <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{
                      display: 'block',
                      ...typography.bodySmall,
                      fontWeight: typography.semibold,
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Current Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter your current password"
                      value={oldPassword}
                      onChange={e => setOldPassword(e.target.value)}
                      style={{
                        ...inputStyle,
                        width: '100%'
                      }}
                      required
                    />
                  </div>
                  
                  <div>
                    <label style={{
                      display: 'block',
                      ...typography.bodySmall,
                      fontWeight: typography.semibold,
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter your new password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      style={{
                        ...inputStyle,
                        width: '100%'
                      }}
                      required
                    />
                  </div>
                  
                  <div>
                    <label style={{
                      display: 'block',
                      ...typography.bodySmall,
                      fontWeight: typography.semibold,
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Confirm your new password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      style={{
                        ...inputStyle,
                        width: '100%'
                      }}
                      required
                    />
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginTop: '10px'
                  }}>
                    <button 
                      type="submit" 
                      style={{ 
                        ...saveButtonStyle, 
                        backgroundColor: '#10b981',
                        flex: 1,
                        padding: '12px 20px',
                        ...typography.button
                      }}
                    >
                      Update Password
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setOldPassword('');
                        setNewPassword('');
                        setConfirmPassword('');
                        setPasswordMessage('');
                        setPasswordError('');
                      }}
                      style={{
                        ...saveButtonStyle,
                        backgroundColor: '#6b7280',
                        flex: 1,
                        padding: '12px 20px',
                        ...typography.button
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                  
                  {passwordMessage && (
                    <div style={{ 
                      color: 'green', 
                      marginTop: '12px',
                      padding: '8px 12px',
                      backgroundColor: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      borderRadius: '6px',
                      ...typography.bodySmall
                    }}>
                      {passwordMessage}
                    </div>
                  )}
                  {passwordError && (
                    <div style={{ 
                      color: 'red', 
                      marginTop: '12px',
                      padding: '8px 12px',
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: '6px',
                      ...typography.bodySmall
                    }}>
                      {passwordError}
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Animations */}
      <style>
        {`
          @keyframes dashboardFloat {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-30px) rotate(120deg); }
            66% { transform: translateY(30px) rotate(240deg); }
          }
              
          @keyframes dashboardPulse {
            0%, 100% { transform: scale(1); opacity: 0.06; }
            50% { transform: scale(1.15); opacity: 0.12; }
          }
              
          @keyframes slideInLeft {
            from { 
              opacity: 0; 
              transform: translateX(-100px) scale(0.95); 
            }
            to { 
              opacity: 1; 
              transform: translateX(0) scale(1); 
            }
          }
              
          @keyframes slideDown {
            0% {
              opacity: 0;
              transform: translateY(-10px) scale(0.95);
              maxHeight: 0;
              filter: blur(4px);
            }
            50% {
              opacity: 0.7;
              filter: blur(2px);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
              maxHeight: 200px;
              filter: blur(0);
            }
          }
              
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          /* Responsive two-column layout for settings form */
          @media (min-width: 900px) {
            .settings-grid { grid-template-columns: 1fr 1fr; }
          }
        `}
      </style>

    </div>
    </Layout>
  );
}

const inputStyle = {
  padding: '12px 14px',
  border: `1px solid ${colors.border}`,
  borderRadius: '10px',
  background: '#f8fafc',
  color: colors.primaryText,
  ...typography.body,
  fontFamily: typography.secondary,
  outline: 'none',
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
};

const saveButtonStyle = {
  padding: '12px 22px',
  borderRadius: '10px',
  cursor: 'pointer',
  border: 'none',
  ...typography.button,
  transition: 'all 0.3s ease',
  color: 'white',
  backgroundColor: '#4146C9',
  boxShadow: '0 8px 20px rgba(13,148,136,0.25)'
};

const sectionCard = {
  background: 'rgba(255,255,255,0.95)',
  border: `1px solid ${colors.border}`,
  borderRadius: '12px',
  padding: '16px',
};

const sectionHeader = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '10px'
};

const sectionTitle = {
  margin: 0,
  color: colors.primaryText,
  fontWeight: 700,
  fontSize: '1rem'
};

const sectionBadge = {
  fontSize: '0.7rem',
  color: colors.link,
  background: `${colors.link}1A`,
  border: `1px solid ${colors.border}`,
  padding: '2px 8px',
  borderRadius: '9999px',
  fontWeight: 700
};
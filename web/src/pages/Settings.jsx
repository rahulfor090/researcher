import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gradients, colors, shadows, cardStyle } from '../theme';
import { api } from '../api';
import { useAuth } from '../auth';

export default function Settings() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
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

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showProfileMenu) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showProfileMenu]);

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

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill all the fields.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Password should be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    try {
      const response = await api.post('/profile/change-password', {
        oldPassword,
        newPassword,
        confirmPassword,
      });
      if (response.data.success) {
        setPasswordMessage('Password updated successfully!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPasswordMessage(''), 3000);
      } else {
        setPasswordError(response.data.message || 'Failed to update password.');
      }
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to update password.');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      background: gradients.app, 
      fontFamily: 'Inter, sans-serif',
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

      {/* Left Navigation Sidebar */}
      <div 
        style={{ 
          width: '280px', 
          background: gradients.sidebar, 
          color: 'white', 
          padding: '32px', 
          display: 'flex', 
          flexDirection: 'column', 
          boxShadow: shadows.medium, 
          borderTopLeftRadius: '16px', 
          borderBottomLeftRadius: '16px', 
          position: 'relative',
          animation: 'slideInLeft 0.6s ease-out'
        }}
      >
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '700', 
          marginBottom: '16px', 
          color: '#e5e7eb',
          animation: 'fadeInDown 0.8s ease-out 0.2s both'
        }}>Research Locker</h1>
        
        <div 
          onClick={(e) => {
            e.stopPropagation();
            setShowProfileMenu(v => !v);
          }} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            padding: '12px', 
            borderRadius: '12px', 
            background: 'rgba(255,255,255,0.06)', 
            marginBottom: '16px', 
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            animation: 'fadeInUp 0.8s ease-out 0.4s both'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{ 
            width: 40, 
            height: 40, 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #0ea5e9, #22c55e)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontWeight: 700,
            animation: 'pulse 2s infinite'
          }}>
            {initials}
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>{user?.name || 'You'}</div>
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{user?.email || ''}</div>
          </div>
        </div>
        
        {showProfileMenu && (
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{ 
            position: 'relative', 
            top: '0px', 
            left: '0px', 
            right: '0px', 
            background: 'white', 
            color: colors.primaryText, 
            border: `1px solid ${colors.border}`, 
            borderRadius: '12px', 
            boxShadow: shadows.soft, 
            overflow: 'hidden', 
            zIndex: 30, 
            animation: 'slideDown 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards', 
            transformOrigin: 'top center',
            marginBottom: '16px'
          }}>
            <button style={{ 
              display: 'block', 
              padding: '10px 14px', 
              background: 'transparent', 
              border: 'none', 
              width: '100%', 
              textAlign: 'left', 
              cursor: 'pointer',
              transition: 'background 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>Settings</button>
            <button style={{ 
              display: 'block', 
              padding: '10px 14px', 
              background: 'transparent', 
              border: 'none', 
              width: '100%', 
              textAlign: 'left', 
              cursor: 'pointer',
              transition: 'background 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>About</button>
            <button 
              onClick={() => {
                logout();
                nav('/login');
              }}
              style={{ 
                display: 'block', 
                padding: '10px 14px', 
                background: 'transparent', 
                border: 'none', 
                width: '100%', 
                textAlign: 'left', 
                cursor: 'pointer',
                transition: 'background 0.2s ease',
                color: '#dc2626',
                fontWeight: 600
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                e.currentTarget.style.color = '#b91c1c';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#dc2626';
              }}
            >
              Logout
            </button>
          </div>
        )}
        
        <nav style={{ animation: 'fadeInUp 0.8s ease-out 0.6s both' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              { label: 'Dashboard', icon: '🏠', path: '/' },
              { label: 'Library', icon: '📚', path: '/library' },
              { label: 'All insights', icon: '📈', path: null },
              
            ].map(({ label, icon, path }, index) => (
              <li
                key={label}
                style={{
                  padding: '10px 12px',
                  color: '#cbd5e1',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  animation: `fadeInLeft 0.6s ease-out ${0.8 + index * 0.1}s both`
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                  e.currentTarget.style.transform = 'translateX(8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'translateX(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onClick={() => { if (path) nav(path); }}
              >
                <span style={{
                  width: 20,
                  textAlign: 'center',
                  transition: 'transform 0.3s ease'
                }}>{icon}</span>
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </nav>
      </div>

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
            fontSize: '2.25rem', 
            fontWeight: 700, 
            color: '#1f2937', 
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #1f2937, #4b5563)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>Settings</h2>
        </div>
        
        <div style={{ 
          ...cardStyle,
          animation: 'fadeInUp 0.8s ease-out 0.7s both'
        }}>
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 600 }}>
            {/* Profile Image */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div 
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: profile_image ? 'transparent' : gradients.primary,
                    margin: '0 auto 10px',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '3px solid #fff',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => document.getElementById('profileImageInput').click()}
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
                    background: 'transparent',
                    border: 'none',
                    color: colors.link,
                    cursor: 'pointer',
                    fontSize: '14px',
                    textDecoration: 'underline',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    marginTop: '8px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)'}
                  onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                >
                  {profile_image ? 'Change photo' : 'Upload photo'}
                </button>
                {saveMessage && <div style={{ color: 'green', marginTop: '8px' }}>{saveMessage}</div>}
                {error && <div style={{ color: 'red', marginTop: '8px' }}>{error}</div>}
              </div>
            </div>
            <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} style={inputStyle} required />
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} required />
            <input type="text" placeholder="Phone Number" value={phone_number} onChange={e => setPhoneNumber(e.target.value)} style={inputStyle} />
            <select value={gender} onChange={e => setGender(e.target.value)} style={inputStyle}>
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input type="text" placeholder="University" value={university} onChange={e => setUniversity(e.target.value)} style={inputStyle} />
            <input type="text" placeholder="Department" value={department} onChange={e => setDepartment(e.target.value)} style={inputStyle} />
            <input type="text" placeholder="Program" value={program} onChange={e => setProgram(e.target.value)} style={inputStyle} />
            <input type="text" placeholder="Year of Study" value={year_of_study} onChange={e => setYearOfStudy(e.target.value)} style={inputStyle} />
            <input type="text" placeholder="Research Area" value={research_area} onChange={e => setResearchArea(e.target.value)} style={inputStyle} />
            <input type="text" placeholder="Research Interests" value={research_interests} onChange={e => setResearchInterests(e.target.value)} style={inputStyle} />
            <input type="text" placeholder="Publications" value={publications} onChange={e => setPublications(e.target.value)} style={inputStyle} />
            <input type="url" placeholder="LinkedIn URL" value={linkedin_url} onChange={e => setLinkedinUrl(e.target.value)} style={inputStyle} />
            <input type="url" placeholder="Google Scholar URL" value={google_scholar_url} onChange={e => setGoogleScholarUrl(e.target.value)} style={inputStyle} />
            <input type="text" placeholder="ORCID ID" value={orcid_id} onChange={e => setOrcidId(e.target.value)} style={inputStyle} />
            <textarea placeholder="Bio" value={bio} onChange={e => setBio(e.target.value)} style={inputStyle} />
            <input type="text" placeholder="Skills" value={skills} onChange={e => setSkills(e.target.value)} style={inputStyle} />
            <button type="submit" style={{ ...saveButtonStyle, marginTop: 12, alignSelf: 'flex-end' }}>Save Profile</button>
            {saveMessage && <div style={{ color: 'green', marginTop: 8 }}>{saveMessage}</div>}
            {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
          </form>

          {/* Change Password Section */}
          <button
            type="button"
            style={{
              ...saveButtonStyle,
              backgroundColor: '#f59e42',
              color: 'white',
              marginTop: 20,
              marginBottom: 8
            }}
            onClick={() => setShowPasswordForm(v => !v)}
          >
            Change Password
          </button>
          {showPasswordForm && (
            <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 400, marginTop: 16 }}>
              <input
                type="password"
                placeholder="Previous Password"
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
                style={inputStyle}
                required
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                style={inputStyle}
                required
              />
              <input
                type="password"
                placeholder="Re-enter New Password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                style={inputStyle}
                required
              />
              <button type="submit" style={{ ...saveButtonStyle, backgroundColor: '#10b981' }}>
                Update Password
              </button>
              {passwordMessage && <div style={{ color: 'green', marginTop: 8 }}>{passwordMessage}</div>}
              {passwordError && <div style={{ color: 'red', marginTop: 8 }}>{passwordError}</div>}
            </form>
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
              
          @keyframes fadeInRight {
            from { 
              opacity: 0; 
              transform: translateX(50px) scale(0.95); 
            }
            to { 
              opacity: 1; 
              transform: translateX(0) scale(1); 
            }
          }
              
          @keyframes fadeInDown {
            from { 
              opacity: 0; 
              transform: translateY(-30px) scale(0.95); 
            }
            to { 
              opacity: 1; 
              transform: translateY(0) scale(1); 
            }
          }
              
          @keyframes fadeInUp {
            from { 
              opacity: 0; 
              transform: translateY(30px) scale(0.95); 
            }
            to { 
              opacity: 1; 
              transform: translateY(0) scale(1); 
            }
          }
              
          @keyframes fadeInLeft {
            from { 
              opacity: 0; 
              transform: translateX(-30px) scale(0.95); 
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
        `}
      </style>
    </div>
  );
}

const inputStyle = {
  padding: '10px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '1rem',
};

const saveButtonStyle = {
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
  border: 'none',
  fontSize: '1rem',
  backgroundColor: '#007bff',
  color: 'white',
};
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gradients, colors, shadows, cardStyle } from '../theme';
import { api } from '../api';

export default function Settings() {
  const nav = useNavigate();


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

  // Load user profile
  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data } = await api.get('/profile');
        if (data) {
          setName(data.name || '');
          setEmail(data.email || '');
          setPhoneNumber(data.phone_number || '');
          setProfileImage(data.profile_image || '');
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

  // Handle profile image upload (preview only)
  const handleProfileImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('Image size should be less than 5MB');
      return;
    }
    // Create a preview URL for the selected file
    const previewUrl = URL.createObjectURL(file);
    setProfileImage({ file, previewUrl });
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

    // Add all text fields to formData
    Object.entries(textFields).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
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
      setProfileImage(data.profile_image);
    }

    setSaveMessage('Profile saved successfully!');
  } catch (err) {
    console.error('Save error:', err);
    setError('Failed to save profile.');
  }
};

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: gradients.app, fontFamily: 'Inter, sans-serif' }}>
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
          position: 'relative'
        }}
      >
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 700, 
          marginBottom: '16px', 
          color: '#e5e7eb'
        }}>Research Locker</h1>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ padding: '10px 12px', color: '#cbd5e1', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => nav('/')}>🏠 Dashboard</li>
            <li style={{ padding: '10px 12px', color: '#cbd5e1', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => nav('/library')}>📚 Library</li>
            <li style={{ padding: '10px 12px', color: '#cbd5e1', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>🗂️ Collections</li>
            <li style={{ padding: '10px 12px', color: '#cbd5e1', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>📈 All insights</li>
            <li style={{ padding: '10px 12px', color: '#cbd5e1', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 'bold', background: 'rgba(255,255,255,0.12)' }}>⚙️ Settings</li>
          </ul>
        </nav>
      </div>
      <div>
        
      </div>

      {/* Main Content Area */}

      <div style={{ flexGrow: 1, padding: '40px', display: 'flex', flexDirection: 'column', borderTopRightRadius: '16px', borderBottomRightRadius: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 700, color: '#1f2937', letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #1f2937, #4b5563)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Settings</h2>
        </div>
        <div style={{ ...cardStyle }}>
           <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 600 }}>
  {/* Profile Image */}
  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
  <img
    src={
      profile_image?.previewUrl || // Show preview URL if available
      profile_image?.file ? URL.createObjectURL(profile_image.file) : // Show file preview if it's a File
      profile_image || // Show existing image URL from server
      'https://via.placeholder.com/80?text=Photo' // Fallback placeholder
    }
    alt="Profile"
    style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e5e7eb' }}
  />
  <input 
    type="file" 
    accept="image/*"
    onChange={handleProfileImageChange}
    style={{ maxWidth: '220px' }}
  />
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

        </div>
      </div>
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
import React, { useEffect, useState } from 'react';

export default function Profile({ api, token }) {
  const [profile, setProfile] = useState({});
  const [saved, setSaved] = useState(false);
  const [photoPreview, setPhotoPreview] = useState('');

  useEffect(() => {
    fetch(`${api}/api/public/profile`).then(r => r.json()).then(p => {
      setProfile(p);
      if (p.profile_image_url) setPhotoPreview(p.profile_image_url);
    });
  }, [api]);

  const handleSave = async () => {
    const h = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
    const res = await fetch(`${api}/api/admin/profile`, {
      method: 'PUT', headers: h, body: JSON.stringify(profile)
    });
    const data = await res.json();
    if (data.success) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhotoPreview(ev.target.result);
      setProfile({...profile, profile_image_url: ev.target.result});
    };
    reader.readAsDataURL(file);
  };

  const fields = [
    ['full_name', 'Full Name'], ['hero_headline', 'Hero Headline'], ['tagline', 'Tagline'],
    ['bio', 'Short Bio'], ['mission', 'Mission Statement'],
    ['email', 'Email'], ['phone', 'Phone'], ['location', 'Location'],
    ['github_url', 'GitHub URL'], ['linkedin_url', 'LinkedIn URL'],
    ['twitter_url', 'Twitter URL'], ['profile_image_url', 'Profile Image URL'], ['resume_url', 'Resume URL'],
  ];

  return (
    <div>
      <h1>👤 Profile Kitchen</h1>
      {saved && <div className="success">✅ Profile saved!</div>}
      <div className="photo-upload-section">
        <h3>📸 Profile Photo</h3>
        <div className="photo-preview">
          {photoPreview ? <img src={photoPreview} alt="Profile" className="profile-photo-preview" /> : <div className="photo-placeholder">🛡️</div>}
        </div>
        <input type="file" accept="image/*" onChange={handlePhotoUpload} />
      </div>
      <div className="form-grid">
        {fields.map(([key, label]) => (
          <label key={key} className={key === 'bio' || key === 'mission' ? 'full-width' : ''}>
            {label}
            {key === 'bio' || key === 'mission' ? (
              <textarea rows="3" value={profile[key] || ''} onChange={e => setProfile({...profile, [key]: e.target.value})} />
            ) : (
              <input type="text" value={profile[key] || ''} onChange={e => setProfile({...profile, [key]: e.target.value})} />
            )}
          </label>
        ))}
      </div>
      <button onClick={handleSave} className="btn-primary">💾 Save Everything</button>
    </div>
  );
}

import React from 'react';

export default function About({ profile }) {
  return (
    <div className="page">
      <h1 className="page-title kinetic-text reveal">👤 About Me</h1>
      <div className="about-content">
        <div className="about-card reveal magnetic"><div className="about-avatar">{profile.profile_image_url ? <img src={profile.profile_image_url} alt={profile.full_name} className="about-photo" /> : "🛡️"}</div>
          <h2>{profile.full_name || 'Vinnius Mbuthia'}</h2>
          <p className="about-tagline">{profile.tagline}</p></div>
        <div className="about-card reveal"><h3>📋 Bio</h3><p>{profile.bio}</p></div>
        <div className="about-card reveal"><h3>🎯 Mission</h3><p>{profile.mission}</p></div>
        <div className="about-card reveal"><h3>📍 Details</h3>
          {profile.location && <p>📍 {profile.location}</p>}
          {profile.email && <p>📧 {profile.email}</p>}
          {profile.phone && <p>📱 {profile.phone}</p>}</div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
const API = 'http://localhost:5001/api/public';
const TYPE_ICONS = { music: '🎵', game: '🎮', video: '🎬', image: '🖼️', post: '📝' };
export default function Feed() {
  const [items, setItems] = useState([]);
  useEffect(() => { fetch(`${API}/feed`).then(r => r.json()).then(setItems); }, []);
  return (
    <div className="page">
      <h1 className="page-title">🎮 Vinnius Feed</h1>
      <p className="page-subtitle">My favorite music, games, videos, and more.</p>
      <div className="projects-grid">
        {items.map(i => (
          <div key={i.id} className="project-card">
            <div className="project-card-header">
              <span className="project-icon">{TYPE_ICONS[i.type] || '📝'}</span>
              <span className="project-category">{i.category}</span>
            </div>
            <h3>{i.title}</h3>
            <p>{i.description}</p>
            {i.media_url && (i.type === 'image' ? <img src={i.media_url} alt={i.title} style={{width:'100%',borderRadius:'8px'}} /> : 
              i.type === 'video' ? <video src={i.media_url} controls style={{width:'100%',borderRadius:'8px'}} /> :
              i.type === 'music' ? <audio src={i.media_url} controls style={{width:'100%'}} /> : null)}
            {i.external_link && <a href={i.external_link} target="_blank" rel="noreferrer" className="btn-secondary">🔗 Open</a>}
          </div>
        ))}
      </div>
    </div>
  );
}

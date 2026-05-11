import React, { useEffect, useState } from 'react';
const API = 'http://localhost:5001/api/public';
export default function Resources() {
  const [items, setItems] = useState([]);
  useEffect(() => { fetch(`${API}/resources`).then(r => r.json()).then(setItems); }, []);
  return (
    <div className="page">
      <h1 className="page-title">🛠️ Developer Resources</h1>
      <p className="page-subtitle">Tools, links, and recommendations for devs.</p>
      <div className="projects-grid">
        {items.map(i => (
          <div key={i.id} className="project-card">
            {i.image_url && <img src={i.image_url} alt={i.title} style={{width:'100%',borderRadius:'12px',marginBottom:'10px'}} />}
            <span className="project-category">{i.category}</span>
            <h3>{i.title}</h3>
            <p>{i.description}</p>
            {i.video_url && <video src={i.video_url} controls style={{width:'100%',borderRadius:'8px',marginTop:'10px'}} />}
            {i.link_url && <a href={i.link_url} target="_blank" rel="noreferrer" className="btn-primary">🔗 Get It</a>}
          </div>
        ))}
      </div>
    </div>
  );
}

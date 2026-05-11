import React, { useEffect, useState } from 'react';
const API = 'http://localhost:5001/api/public';
export default function HallOfFame() {
  const [items, setItems] = useState([]);
  useEffect(() => { fetch(`${API}/halloffame`).then(r => r.json()).then(setItems); }, []);
  return (
    <div className="page">
      <h1 className="page-title">🏆 Hall of Fame</h1>
      <p className="page-subtitle">Achievements, awards, and recognition.</p>
      <div className="projects-grid">
        {items.map(i => (
          <div key={i.id} className="project-card">
            {i.image_url && <img src={i.image_url} alt={i.title} style={{width:'100%',borderRadius:'12px',marginBottom:'10px'}} />}
            <h3>🏆 {i.title}</h3>
            <p>{i.description}</p>
            {i.link_url && <a href={i.link_url} target="_blank" rel="noreferrer" className="btn-primary">🔗 View</a>}
          </div>
        ))}
      </div>
    </div>
  );
}

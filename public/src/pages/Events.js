import React, { useEffect, useState } from 'react';
const API = 'https://vinnias.pythonanywhere.com/api/public';
export default function Events() {
  const [items, setItems] = useState([]);
  useEffect(() => { fetch(`${API}/events`).then(r => r.json()).then(setItems); }, []);
  return (
    <div className="page">
      <h1 className="page-title">📅 Events</h1>
      <p className="page-subtitle">Upcoming and past events.</p>
      <div className="projects-grid">
        {items.map(i => (
          <div key={i.id} className="project-card">
            {i.image_url && <img src={i.image_url} alt={i.title} style={{width:'100%',borderRadius:'12px',marginBottom:'10px'}} />}
            <span className="project-category">{i.event_date}</span>
            <h3>{i.title}</h3>
            <p>{i.description}</p>
            {i.location && <p>📍 {i.location}</p>}
            {i.link_url && <a href={i.link_url} target="_blank" rel="noreferrer" className="btn-primary">🔗 Event Link</a>}
          </div>
        ))}
      </div>
    </div>
  );
}

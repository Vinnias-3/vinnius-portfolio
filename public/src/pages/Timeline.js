import React, { useEffect, useState } from 'react';
const API = 'https://vinnias.pythonanywhere.com/api/public';
export default function Timeline() {
  const [items, setItems] = useState([]);
  useEffect(() => { fetch(`${API}/timeline`).then(r => r.json()).then(setItems); }, []);
  return (
    <div className="page">
      <h1 className="page-title">🕒 My Journey</h1>
      <p className="page-subtitle">From where I started to where I'm going.</p>
      <div className="timeline-list">
        {items.map(i => (
          <div key={i.id} className="about-card" style={{marginBottom:'15px'}}>
            <h3>{i.icon} {i.year} — {i.title}</h3>
            <p>{i.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

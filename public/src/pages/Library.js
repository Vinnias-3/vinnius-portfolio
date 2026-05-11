import React, { useEffect, useState } from 'react';
const API = 'http://localhost:5001/api/public';
export default function Library() {
  const [items, setItems] = useState([]);
  useEffect(() => { fetch(`${API}/library`).then(r => r.json()).then(setItems); }, []);
  return (
    <div className="page">
      <h1 className="page-title">📚 Library</h1>
      <p className="page-subtitle">Read online or download. Knowledge shared freely.</p>
      <div className="projects-grid">
        {items.map(i => (
          <div key={i.id} className="project-card">
            <div className="project-card-header">
              <span className="project-icon">📚</span>
              <span className="project-category">{i.category}</span>
            </div>
            <h3>{i.title}</h3>
            <p>{i.description}</p>
            <div className="project-links">
              {i.pdf_url && <a href={i.pdf_url} target="_blank" rel="noreferrer" className="btn-primary">📖 Read Online</a>}
              {i.pdf_url && <a href={i.pdf_url} download className="btn-secondary">📥 Download</a>}
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="empty">No books added yet. Check back soon!</p>}
      </div>
    </div>
  );
}

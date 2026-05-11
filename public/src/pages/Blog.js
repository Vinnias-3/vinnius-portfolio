import React, { useEffect, useState } from 'react';
const API = 'http://localhost:5001/api/public';
export default function Blog() {
  const [posts, setPosts] = useState([]);
  useEffect(() => { fetch(`${API}/posts`).then(r => r.json()).then(setPosts); }, []);
  return (
    <div className="page">
      <h1 className="page-title">📰 Blog</h1>
      <p className="page-subtitle">Thoughts, tutorials, and updates.</p>
      <div className="projects-grid">
        {posts.map(p => (
          <div key={p.id} className="project-card">
            {p.image_url && <img src={p.image_url} alt={p.title} style={{width:'100%',borderRadius:'12px',marginBottom:'10px'}} />}
            <span className="project-category">{p.category}</span>
            <h3>{p.title}</h3>
            <p>{p.content?.substring(0, 200)}...</p>
            {p.external_link && <a href={p.external_link} target="_blank" rel="noreferrer" className="btn-secondary">🔗 Read More</a>}
            {p.video_url && <video src={p.video_url} controls style={{width:'100%',borderRadius:'8px',marginTop:'10px'}} />}
          </div>
        ))}
      </div>
    </div>
  );
}

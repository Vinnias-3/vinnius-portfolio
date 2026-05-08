import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Projects({ api }) {
  const [projects, setProjects] = useState([]);
  useEffect(() => { fetch(`${api}/projects`).then(r => r.json()).then(setProjects); }, [api]);

  return (
    <div className="page">
      <h1 className="page-title kinetic-text reveal">💼 My Projects</h1>
      <p className="page-subtitle reveal">Every project built with purpose.</p>
      <div className="projects-grid">
        {projects.map((p, i) => (
          <Link to={`/projects/${p.slug}`} key={p.id} className="project-card tilt magnetic reveal" 
            data-cursor="Explore" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="project-card-header">
              <span className="project-icon">🚀</span>
              <span className="project-category">{p.category}</span>
            </div>
            <h3>{p.title}</h3>
            <p>{p.short_description}</p>
            <div className="project-tech">
              {p.technologies.split(',').map((t, i) => <span key={i} className="tech-badge">{t.trim()}</span>)}
            </div>
            {p.is_featured ? <span className="featured-badge">⭐ Featured</span> : null}
          </Link>
        ))}
      </div>
    </div>
  );
}

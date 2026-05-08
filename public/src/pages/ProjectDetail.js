import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function ProjectDetail({ api }) {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    fetch(`${api}/projects/${slug}`).then(r => r.json()).then(p => {
      setProject(p);
      if (p.category) {
        fetch(`https://vinnius-portfolio-api.onrender.com/api/public/pexels-images?query=${encodeURIComponent(p.category)}&per_page=6`)
          .then(r => r.json()).then(setPhotos);
      }
    });
  }, [slug, api]);

  if (!project) return <div className="page"><p>Loading...</p></div>;

  return (
    <div className="page reveal">
      <Link to="/projects" className="back-link magnetic">← Back</Link>
      <h1 className="page-title kinetic-text">{project.title}</h1>
      <span className="project-category">{project.category}</span>
      {project.is_featured && <span className="featured-badge">⭐ Featured</span>}
      <p className="project-description">{project.short_description}</p>
      {project.full_description && <div className="project-body">{project.full_description}</div>}
      <div className="project-tech"><h3>Technologies</h3>
        {project.technologies.split(',').map((t, i) => <span key={i} className="tech-badge">{t.trim()}</span>)}
      </div>
      <div className="project-links">
        {project.live_demo_url && <a href={project.live_demo_url} target="_blank" rel="noreferrer" className="btn-primary magnetic">🔗 Live Demo</a>}
        {project.github_url && <a href={project.github_url} target="_blank" rel="noreferrer" className="btn-secondary magnetic">🐙 View Code</a>}
      </div>
      {photos.length > 0 && (
        <div className="project-gallery">
          <h3>Gallery (via Pexels)</h3>
          <div className="gallery-grid">
            {photos.map(p => <img key={p.id} src={p.medium} alt={p.alt} loading="lazy" />)}
          </div>
          <p className="photo-credit">📸 Photos by {photos[0]?.photographer} on Pexels</p>
        </div>
      )}
    </div>
  );
}

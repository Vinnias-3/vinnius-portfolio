import React, { useEffect, useState } from 'react';

export default function Projects({ api, token }) {
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    const h = { 'Authorization': `Bearer ${token}` };
    fetch(`${api}/api/admin/projects`, { headers: h })
      .then(r => r.json())
      .then(d => setProjects(Array.isArray(d) ? d : []));
  }, [api, token]);

  const empty = { title: '', slug: '', short_description: '', full_description: '', category: 'Web Development', thumbnail: '', live_demo_url: '', github_url: '', technologies: '', is_featured: 0, is_published: 1, sort_order: 0 };

  const save = () => {
    const h = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
    const url = editing?.id ? `${api}/api/admin/projects/${editing.id}` : `${api}/api/admin/projects`;
    fetch(url, { method: editing?.id ? 'PUT' : 'POST', headers: h, body: JSON.stringify(editing) })
      .then(() => {
        setEditing(null);
        const h2 = { 'Authorization': `Bearer ${token}` };
        fetch(`${api}/api/admin/projects`, { headers: h2 }).then(r => r.json()).then(d => setProjects(Array.isArray(d) ? d : []));
      });
  };

  return (
    <div>
      <h1>Projects ({projects.length})</h1>
      <button onClick={() => setEditing(empty)} className="btn-primary">+ New Project</button>
      {editing && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editing.id ? 'Edit' : 'New'} Project</h2>
            {['title','slug','short_description','category','thumbnail','live_demo_url','github_url','technologies'].map(f => (
              <label key={f}>{f}<input type="text" value={editing[f] || ''} onChange={e => setEditing({...editing, [f]: e.target.value})} /></label>
            ))}
            <label>Featured <input type="checkbox" checked={editing.is_featured} onChange={e => setEditing({...editing, is_featured: e.target.checked ? 1 : 0})} /></label>
            <label>Published <input type="checkbox" checked={editing.is_published} onChange={e => setEditing({...editing, is_published: e.target.checked ? 1 : 0})} /></label>
            <div className="btn-row"><button onClick={save} className="btn-primary">Save</button><button onClick={() => setEditing(null)} className="btn-secondary">Cancel</button></div>
          </div>
        </div>
      )}
      <div className="list">
        {projects.map(p => (
          <div key={p.id} className="list-item">
            <div><strong>{p.title}</strong><span className="badge">{p.category}</span>{p.is_featured ? <span className="badge featured">⭐</span> : null}</div>
            <div><button onClick={() => setEditing(p)}>Edit</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}

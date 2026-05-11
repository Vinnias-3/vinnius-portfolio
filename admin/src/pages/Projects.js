import React, { useEffect, useState, useCallback } from 'react';
const API_URL = 'http://localhost:5001';
export default function Projects({ api, token }) {
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const h = (extra = {}) => ({ 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', ...extra });

  const load = useCallback(async () => {
    const d = await fetch(`${api}/api/admin/projects`, { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json());
    setProjects(Array.isArray(d) ? d : []);
  }, [api, token]);
  useEffect(() => { load(); }, [load]);

  const empty = { title: '', slug: '', short_description: '', full_description: '', category: 'Web Development', thumbnail: '', live_demo_url: '', github_url: '', technologies: '', is_featured: 0, is_published: 1 };

  const uploadThumbnail = async (file) => {
    setUploading(true);
    const fd = new FormData(); fd.append('image', file);
    const res = await fetch(`${API_URL}/api/admin/upload`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: fd });
    const data = await res.json();
    if (data.url) setEditing({ ...editing, thumbnail: `${API_URL}${data.url}` });
    setUploading(false);
  };

  const save = async () => {
    const url = editing?.id ? `${api}/api/admin/projects/${editing.id}` : `${api}/api/admin/projects`;
    const method = editing?.id ? 'PUT' : 'POST';
    await fetch(url, { method, headers: h(), body: JSON.stringify(editing) });
    setEditing(null); load();
  };
  const remove = async (id) => { await fetch(`${api}/api/admin/projects/${id}`, { method: 'DELETE', headers: h() }); load(); };

  return (
    <div><h1>💼 Projects ({projects.length})</h1><button onClick={() => setEditing(empty)} className="btn-primary">+ New Project</button>
      {editing && <div className="modal"><div className="modal-content"><h2>{editing.id ? 'Edit' : 'New'} Project</h2>
        {['title','slug','short_description','category','live_demo_url','github_url','technologies'].map(f => <label key={f}>{f}<input type="text" value={editing[f]||''} onChange={e => setEditing({...editing, [f]: e.target.value})} /></label>)}
        <div className="upload-section">
          <label>🖼️ Thumbnail</label>
          <input type="file" accept="image/*" onChange={e => uploadThumbnail(e.target.files[0])} />
          {editing.thumbnail && <img src={editing.thumbnail} alt="Thumb" className="image-preview" />}
        </div>
        <label>Featured <input type="checkbox" checked={editing.is_featured} onChange={e => setEditing({...editing, is_featured: e.target.checked ? 1 : 0})} /></label>
        <label>Published <input type="checkbox" checked={editing.is_published} onChange={e => setEditing({...editing, is_published: e.target.checked ? 1 : 0})} /></label>
        <div className="btn-row"><button onClick={save} className="btn-primary" disabled={uploading}>{uploading?'Uploading...':'💾 Save'}</button><button onClick={() => setEditing(null)} className="btn-secondary">Cancel</button></div></div></div>}
      <div className="list">{projects.map(p => <div key={p.id} className="list-item"><div><strong>{p.title}</strong><span className="badge">{p.category}</span></div><div><button onClick={() => setEditing(p)}>✏️</button><button onClick={() => remove(p.id)}>🗑️</button></div></div>)}</div></div>);
}

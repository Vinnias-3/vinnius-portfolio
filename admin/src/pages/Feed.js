import React, { useEffect, useState } from 'react';
const API = 'http://localhost:5001';
export default function Feed({ api, token }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const h = (extra = {}) => ({ 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', ...extra });
  const load = () => fetch(`${api}/api/admin/feed`, { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json()).then(setItems);
  useEffect(() => { load(); }, []);
  const empty = { type: 'post', title: '', description: '', media_url: '', external_link: '', category: 'General' };
  
  const uploadFile = async (file, field) => {
    setUploading(true);
    const fd = new FormData(); fd.append('image', file);
    const res = await fetch(`${API}/api/admin/upload`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: fd });
    const data = await res.json();
    if (data.url) setEditing({ ...editing, [field]: `${API}${data.url}` });
    setUploading(false);
  };
  
  const save = async () => {
    const url = editing?.id ? `${api}/api/admin/feed/${editing.id}` : `${api}/api/admin/feed`;
    await fetch(url, { method: editing?.id ? 'PUT' : 'POST', headers: h(), body: JSON.stringify(editing) });
    setEditing(null); load();
  };
  const remove = async (id) => { await fetch(`${api}/api/admin/feed/${id}`, { method: 'DELETE', headers: h() }); load(); };
  return (
    <div><h1>🎮 Vinnius Feed</h1><button onClick={() => setEditing(empty)} className="btn-primary">+ Add Item</button>
      {editing && <div className="modal"><div className="modal-content"><h2>{editing.id ? 'Edit' : 'New'} Feed Item</h2>
        <label>Type<select value={editing.type} onChange={e => setEditing({...editing, type: e.target.value})}><option value="music">🎵 Music</option><option value="game">🎮 Game</option><option value="video">🎬 Video</option><option value="image">🖼️ Image</option><option value="post">📝 Post</option></select></label>
        <label>Title<input type="text" value={editing.title||''} onChange={e => setEditing({...editing, title: e.target.value})} /></label>
        <label>Description<input type="text" value={editing.description||''} onChange={e => setEditing({...editing, description: e.target.value})} /></label>
        <label>Category<input type="text" value={editing.category||''} onChange={e => setEditing({...editing, category: e.target.value})} /></label>
        <div className="upload-section">
          <label>📁 Media File (image/video/audio)</label>
          <input type="file" accept="image/*,video/*,audio/*" onChange={e => uploadFile(e.target.files[0], 'media_url')} />
          {editing.media_url && <p className="uploaded">✅ Uploaded</p>}
        </div>
        <label>External Link<input type="text" value={editing.external_link||''} onChange={e => setEditing({...editing, external_link: e.target.value})} placeholder="https://..." /></label>
        <div className="btn-row"><button onClick={save} className="btn-primary" disabled={uploading}>{uploading?'Uploading...':'💾 Save'}</button><button onClick={() => setEditing(null)} className="btn-secondary">Cancel</button></div></div></div>}
      <div className="list">{items.map(i => <div key={i.id} className="list-item"><div><strong>{i.type==='music'?'🎵':i.type==='game'?'🎮':i.type==='video'?'🎬':i.type==='image'?'🖼️':'📝'} {i.title}</strong><span className="badge">{i.category}</span></div><div><button onClick={() => setEditing(i)}>✏️</button><button onClick={() => remove(i.id)}>🗑️</button></div></div>)}</div></div>);
}

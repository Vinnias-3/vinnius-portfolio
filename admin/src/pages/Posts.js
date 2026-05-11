import React, { useEffect, useState } from 'react';
const API = 'https://vinnias.pythonanywhere.com';
export default function Posts({ api, token }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const h = (extra = {}) => ({ 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', ...extra });
  const load = () => fetch(`${api}/api/admin/posts`, { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json()).then(setItems);
  useEffect(() => { load(); }, []);
  const empty = { title: '', content: '', image_url: '', video_url: '', external_link: '', category: 'General' };
  
  const uploadFile = async (file, field) => {
    setUploading(true);
    const fd = new FormData(); fd.append('image', file);
    const res = await fetch(`${API}/api/admin/upload`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: fd });
    const data = await res.json();
    if (data.url) setEditing({ ...editing, [field]: `${API}${data.url}` });
    setUploading(false);
  };
  
  const save = async () => {
    const url = editing?.id ? `${api}/api/admin/posts/${editing.id}` : `${api}/api/admin/posts`;
    await fetch(url, { method: editing?.id ? 'PUT' : 'POST', headers: h(), body: JSON.stringify(editing) });
    setEditing(null); load();
  };
  const remove = async (id) => { await fetch(`${api}/api/admin/posts/${id}`, { method: 'DELETE', headers: h() }); load(); };
  return (
    <div><h1>📰 Posts</h1><button onClick={() => setEditing(empty)} className="btn-primary">+ New Post</button>
      {editing && <div className="modal"><div className="modal-content"><h2>{editing.id ? 'Edit' : 'New'} Post</h2>
        <label>Title<input type="text" value={editing.title||''} onChange={e => setEditing({...editing, title: e.target.value})} /></label>
        <label>Category<input type="text" value={editing.category||''} onChange={e => setEditing({...editing, category: e.target.value})} /></label>
        <label>Content<textarea rows="6" value={editing.content||''} onChange={e => setEditing({...editing, content: e.target.value})} /></label>
        <div className="upload-section">
          <label>🖼️ Image</label>
          <input type="file" accept="image/*" onChange={e => uploadFile(e.target.files[0], 'image_url')} />
          {editing.image_url && <img src={editing.image_url} alt="Preview" className="image-preview" />}
        </div>
        <div className="upload-section">
          <label>🎬 Video</label>
          <input type="file" accept="video/*" onChange={e => uploadFile(e.target.files[0], 'video_url')} />
          {editing.video_url && <p className="uploaded">✅ Video uploaded</p>}
        </div>
        <label>External Link<input type="text" value={editing.external_link||''} onChange={e => setEditing({...editing, external_link: e.target.value})} placeholder="https://..." /></label>
        <div className="btn-row"><button onClick={save} className="btn-primary" disabled={uploading}>{uploading?'Uploading...':'💾 Save'}</button><button onClick={() => setEditing(null)} className="btn-secondary">Cancel</button></div></div></div>}
      <div className="list">{items.map(i => <div key={i.id} className="list-item"><div><strong>📰 {i.title}</strong><span className="badge">{i.category}</span></div><div><button onClick={() => setEditing(i)}>✏️</button><button onClick={() => remove(i.id)}>🗑️</button></div></div>)}</div></div>);
}

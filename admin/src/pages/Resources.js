import React, { useEffect, useState } from 'react';
const API = 'https://vinnias.pythonanywhere.com';
export default function Resources({ api, token }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const h = (extra = {}) => ({ 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', ...extra });
  const load = () => fetch(`${api}/api/admin/resources`, { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json()).then(setItems);
  useEffect(() => { load(); }, []);
  const empty = { title: '', description: '', category: 'General', link_url: '', image_url: '', video_url: '' };
  
  const uploadFile = async (file, field) => {
    setUploading(true);
    const fd = new FormData(); fd.append('image', file);
    const res = await fetch(`${API}/api/admin/upload`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: fd });
    const data = await res.json();
    if (data.url) setEditing({ ...editing, [field]: `${API}${data.url}` });
    setUploading(false);
  };
  
  const save = async () => {
    const url = editing?.id ? `${api}/api/admin/resources/${editing.id}` : `${api}/api/admin/resources`;
    await fetch(url, { method: editing?.id ? 'PUT' : 'POST', headers: h(), body: JSON.stringify(editing) });
    setEditing(null); load();
  };
  const remove = async (id) => { await fetch(`${api}/api/admin/resources/${id}`, { method: 'DELETE', headers: h() }); load(); };
  return (
    <div><h1>🛠️ Dev Resources</h1><button onClick={() => setEditing(empty)} className="btn-primary">+ Add Resource</button>
      {editing && <div className="modal"><div className="modal-content"><h2>{editing.id ? 'Edit' : 'New'} Resource</h2>
        <label>Title<input type="text" value={editing.title||''} onChange={e => setEditing({...editing, title: e.target.value})} /></label>
        <label>Description<input type="text" value={editing.description||''} onChange={e => setEditing({...editing, description: e.target.value})} /></label>
        <label>Category<input type="text" value={editing.category||''} onChange={e => setEditing({...editing, category: e.target.value})} /></label>
        <label>Link URL<input type="text" value={editing.link_url||''} onChange={e => setEditing({...editing, link_url: e.target.value})} /></label>
        <div className="upload-section"><label>🖼️ Image</label><input type="file" accept="image/*" onChange={e => uploadFile(e.target.files[0], 'image_url')} />{editing.image_url && <img src={editing.image_url} alt="Preview" className="image-preview" />}</div>
        <div className="upload-section"><label>🎬 Video</label><input type="file" accept="video/*" onChange={e => uploadFile(e.target.files[0], 'video_url')} />{editing.video_url && <p className="uploaded">✅ Uploaded</p>}</div>
        <div className="btn-row"><button onClick={save} className="btn-primary" disabled={uploading}>{uploading?'Uploading...':'💾 Save'}</button><button onClick={() => setEditing(null)} className="btn-secondary">Cancel</button></div></div></div>}
      <div className="list">{items.map(i => <div key={i.id} className="list-item"><div><strong>🛠️ {i.title}</strong><span className="badge">{i.category}</span></div><div><button onClick={() => setEditing(i)}>✏️</button><button onClick={() => remove(i.id)}>🗑️</button></div></div>)}</div></div>);
}

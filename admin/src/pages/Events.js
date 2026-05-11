import React, { useEffect, useState } from 'react';
const API = 'https://vinnias.pythonanywhere.com';
export default function Events({ api, token }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const h = (extra = {}) => ({ 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', ...extra });
  const load = () => fetch(`${api}/api/admin/events`, { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json()).then(setItems);
  useEffect(() => { load(); }, []);
  const empty = { title: '', description: '', event_date: '', location: '', image_url: '', link_url: '' };
  
  const uploadFile = async (file, field) => {
    setUploading(true);
    const fd = new FormData(); fd.append('image', file);
    const res = await fetch(`${API}/api/admin/upload`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: fd });
    const data = await res.json();
    if (data.url) setEditing({ ...editing, [field]: `${API}${data.url}` });
    setUploading(false);
  };
  
  const save = async () => {
    const url = editing?.id ? `${api}/api/admin/events/${editing.id}` : `${api}/api/admin/events`;
    await fetch(url, { method: editing?.id ? 'PUT' : 'POST', headers: h(), body: JSON.stringify(editing) });
    setEditing(null); load();
  };
  const remove = async (id) => { await fetch(`${api}/api/admin/events/${id}`, { method: 'DELETE', headers: h() }); load(); };
  return (
    <div><h1>📅 Events</h1><button onClick={() => setEditing(empty)} className="btn-primary">+ Add Event</button>
      {editing && <div className="modal"><div className="modal-content"><h2>{editing.id ? 'Edit' : 'New'} Event</h2>
        <label>Title<input type="text" value={editing.title||''} onChange={e => setEditing({...editing, title: e.target.value})} /></label>
        <label>Description<input type="text" value={editing.description||''} onChange={e => setEditing({...editing, description: e.target.value})} /></label>
        <label>Date<input type="text" value={editing.event_date||''} onChange={e => setEditing({...editing, event_date: e.target.value})} placeholder="2026-05-20" /></label>
        <label>Location<input type="text" value={editing.location||''} onChange={e => setEditing({...editing, location: e.target.value})} /></label>
        <div className="upload-section"><label>🖼️ Image</label><input type="file" accept="image/*" onChange={e => uploadFile(e.target.files[0], 'image_url')} />{editing.image_url && <img src={editing.image_url} alt="Preview" className="image-preview" />}</div>
        <label>Link URL<input type="text" value={editing.link_url||''} onChange={e => setEditing({...editing, link_url: e.target.value})} /></label>
        <div className="btn-row"><button onClick={save} className="btn-primary" disabled={uploading}>{uploading?'Uploading...':'💾 Save'}</button><button onClick={() => setEditing(null)} className="btn-secondary">Cancel</button></div></div></div>}
      <div className="list">{items.map(i => <div key={i.id} className="list-item"><div><strong>📅 {i.title}</strong> — {i.event_date}</div><div><button onClick={() => setEditing(i)}>✏️</button><button onClick={() => remove(i.id)}>🗑️</button></div></div>)}</div></div>);
}

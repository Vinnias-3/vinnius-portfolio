import React, { useEffect, useState } from 'react';
const API = 'https://vinnias.pythonanywhere.com';
export default function Library({ api, token }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const h = (extra = {}) => ({ 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', ...extra });
  const load = () => fetch(`${api}/api/admin/library`, { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json()).then(setItems);
  useEffect(() => { load(); }, []);
  const empty = { title: '', description: '', category: 'General', pdf_url: '', cover_image: '' };
  
  const uploadFile = async (file, field) => {
    if (!file) return;
    setUploading('Uploading...');
    try {
      const fd = new FormData(); fd.append('image', file);
      const res = await fetch(`${API}/api/admin/upload`, { 
        method: 'POST', 
        headers: { 'Authorization': `Bearer ${token}` }, 
        body: fd 
      });
      const data = await res.json();
      if (data.url) {
        setEditing(prev => ({ ...prev, [field]: `${API}${data.url}` }));
      }
    } catch(e) {
      console.error('Upload failed:', e);
    }
    setUploading(false);
  };
  
  const save = async () => {
    const url = editing?.id ? `${api}/api/admin/library/${editing.id}` : `${api}/api/admin/library`;
    await fetch(url, { method: editing?.id ? 'PUT' : 'POST', headers: h(), body: JSON.stringify(editing) });
    setEditing(null); load();
  };
  const remove = async (id) => { await fetch(`${api}/api/admin/library/${id}`, { method: 'DELETE', headers: h() }); load(); };
  return (
    <div><h1>📚 Library</h1><button onClick={() => setEditing(empty)} className="btn-primary">+ Add PDF</button>
      {editing && <div className="modal"><div className="modal-content"><h2>{editing.id ? 'Edit' : 'New'} PDF</h2>
        <label>Title<input type="text" value={editing.title||''} onChange={e => setEditing({...editing, title: e.target.value})} /></label>
        <label>Description<input type="text" value={editing.description||''} onChange={e => setEditing({...editing, description: e.target.value})} /></label>
        <label>Category<input type="text" value={editing.category||''} onChange={e => setEditing({...editing, category: e.target.value})} /></label>
        <div className="upload-section">
          <label>📄 PDF File</label>
          <input type="file" accept=".pdf" onChange={e => uploadFile(e.target.files[0], 'pdf_url')} />
          {editing.pdf_url && <p className="uploaded">✅ Uploaded: {editing.pdf_url.split('/').pop()}</p>}
        </div>
        <div className="upload-section">
          <label>🖼️ Cover Image</label>
          <input type="file" accept="image/*" onChange={e => uploadFile(e.target.files[0], 'cover_image')} />
          {editing.cover_image && <img src={editing.cover_image} alt="Cover" className="image-preview" />}
        </div>
        <div className="btn-row"><button onClick={save} className="btn-primary" disabled={uploading}>{uploading?'Uploading...':'💾 Save'}</button><button onClick={() => setEditing(null)} className="btn-secondary">Cancel</button></div></div></div>}
      <div className="list">{items.map(i => <div key={i.id} className="list-item"><div><strong>📚 {i.title}</strong><span className="badge">{i.category}</span></div><div><button onClick={() => setEditing(i)}>✏️</button><button onClick={() => remove(i.id)}>🗑️</button></div></div>)}</div></div>);
}

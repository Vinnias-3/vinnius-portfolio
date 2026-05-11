import React, { useEffect, useState } from 'react';
export default function Timeline({ api, token }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const h = (extra = {}) => ({ 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', ...extra });
  const load = () => fetch(`${api}/api/admin/timeline`, { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json()).then(setItems);
  useEffect(() => { load(); }, []);
  const empty = { year: '', title: '', description: '', icon: '📌', sort_order: 0 };
  const save = async () => {
    const url = editing?.id ? `${api}/api/admin/timeline/${editing.id}` : `${api}/api/admin/timeline`;
    await fetch(url, { method: editing?.id ? 'PUT' : 'POST', headers: h(), body: JSON.stringify(editing) });
    setEditing(null); load();
  };
  const remove = async (id) => { await fetch(`${api}/api/admin/timeline/${id}`, { method: 'DELETE', headers: h() }); load(); };
  return (
    <div><h1>🕒 Timeline</h1><button onClick={() => setEditing(empty)} className="btn-primary">+ Add Entry</button>
      {editing && <div className="modal"><div className="modal-content"><h2>{editing.id ? 'Edit' : 'New'} Entry</h2>
        {['year','title','description','icon'].map(f => <label key={f}>{f}<input type="text" value={editing[f]||''} onChange={e => setEditing({...editing, [f]: e.target.value})} /></label>)}
        <label>Sort Order<input type="number" value={editing.sort_order||0} onChange={e => setEditing({...editing, sort_order: parseInt(e.target.value)})} /></label>
        <div className="btn-row"><button onClick={save} className="btn-primary">Save</button><button onClick={() => setEditing(null)} className="btn-secondary">Cancel</button></div></div></div>}
      <div className="list">{items.map(i => <div key={i.id} className="list-item"><div><strong>{i.icon} {i.year} — {i.title}</strong></div><div><button onClick={() => setEditing(i)}>✏️</button><button onClick={() => remove(i.id)}>🗑️</button></div></div>)}</div></div>);
}

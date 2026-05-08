import React, { useEffect, useState, useCallback } from 'react';

export default function Skills({ api, token }) {
  const [skills, setSkills] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    const h = { 'Authorization': `Bearer ${token}` };
    const d = await fetch(`${api}/api/admin/skills`, { headers: h }).then(r => r.json());
    setSkills(Array.isArray(d) ? d : []);
  }, [api, token]);

  useEffect(() => { load(); }, [load]);

  const empty = { name: '', percentage: 80, category: 'Technical', icon: '💻', sort_order: 0, is_visible: 1 };
  
  const save = async () => {
    const h = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
    const url = editing?.id ? `${api}/api/admin/skills/${editing.id}` : `${api}/api/admin/skills`;
    const method = editing?.id ? 'PUT' : 'POST';
    await fetch(url, { method, headers: h, body: JSON.stringify(editing) });
    setEditing(null); load();
  };

  const remove = async (id) => {
    const h = { 'Authorization': `Bearer ${token}` };
    await fetch(`${api}/api/admin/skills/${id}`, { method: 'DELETE', headers: h });
    load();
  };

  return (
    <div>
      <h1>🛠️ Skills ({skills.length})</h1>
      <button onClick={() => setEditing(empty)} className="btn-primary">+ New Skill</button>
      {editing && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editing.id ? 'Edit' : 'New'} Skill</h2>
            {['name','icon','category'].map(f => (
              <label key={f}>{f} <input type="text" value={editing[f] || ''} onChange={e => setEditing({...editing, [f]: e.target.value})} /></label>
            ))}
            <label>Percentage <input type="number" value={editing.percentage} onChange={e => setEditing({...editing, percentage: parseInt(e.target.value)})} /></label>
            <label>Visible <input type="checkbox" checked={editing.is_visible} onChange={e => setEditing({...editing, is_visible: e.target.checked ? 1 : 0})} /></label>
            <div className="btn-row"><button onClick={save} className="btn-primary">💾 Save</button><button onClick={() => setEditing(null)} className="btn-secondary">Cancel</button></div>
          </div>
        </div>
      )}
      <div className="list">
        {skills.map(s => (
          <div key={s.id} className="list-item">
            <div><strong>{s.icon} {s.name}</strong> — {s.percentage}% <span className="badge">{s.category}</span></div>
            <div><button onClick={() => setEditing(s)}>✏️</button><button onClick={() => remove(s.id)}>🗑️</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}

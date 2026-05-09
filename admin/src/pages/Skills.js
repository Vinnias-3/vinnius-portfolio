import React, { useEffect, useState } from 'react';

export default function Skills({ api, token }) {
  const [skills, setSkills] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    const h = { 'Authorization': `Bearer ${token}` };
    fetch(`${api}/api/admin/skills`, { headers: h })
      .then(r => r.json())
      .then(d => setSkills(Array.isArray(d) ? d : []));
  }, [api, token]);

  const empty = { name: '', percentage: 80, category: 'Technical', icon: '💻', sort_order: 0, is_visible: 1 };

  const save = () => {
    const h = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
    const url = editing?.id ? `${api}/api/admin/skills/${editing.id}` : `${api}/api/admin/skills`;
    fetch(url, { method: editing?.id ? 'PUT' : 'POST', headers: h, body: JSON.stringify(editing) })
      .then(() => {
        setEditing(null);
        const h2 = { 'Authorization': `Bearer ${token}` };
        fetch(`${api}/api/admin/skills`, { headers: h2 }).then(r => r.json()).then(d => setSkills(Array.isArray(d) ? d : []));
      });
  };

  return (
    <div>
      <h1>Skills ({skills.length})</h1>
      <button onClick={() => setEditing(empty)} className="btn-primary">+ New Skill</button>
      {editing && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editing.id ? 'Edit' : 'New'} Skill</h2>
            {['name','icon','category'].map(f => (
              <label key={f}>{f}<input type="text" value={editing[f] || ''} onChange={e => setEditing({...editing, [f]: e.target.value})} /></label>
            ))}
            <label>Percentage<input type="number" value={editing.percentage} onChange={e => setEditing({...editing, percentage: parseInt(e.target.value)})} /></label>
            <label>Visible<input type="checkbox" checked={editing.is_visible} onChange={e => setEditing({...editing, is_visible: e.target.checked ? 1 : 0})} /></label>
            <div className="btn-row"><button onClick={save} className="btn-primary">Save</button><button onClick={() => setEditing(null)} className="btn-secondary">Cancel</button></div>
          </div>
        </div>
      )}
      <div className="list">
        {skills.map(s => (
          <div key={s.id} className="list-item">
            <div><strong>{s.icon} {s.name}</strong> - {s.percentage}% <span className="badge">{s.category}</span></div>
            <div><button onClick={() => setEditing(s)}>Edit</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}

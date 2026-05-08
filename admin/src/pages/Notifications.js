import React, { useEffect, useState, useCallback } from 'react';

export default function Notifications({ api, token }) {
  const [notifs, setNotifs] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    const h = { 'Authorization': `Bearer ${token}` };
    const d = await fetch(`${api}/api/admin/notifications`, { headers: h }).then(r => r.json());
    setNotifs(Array.isArray(d) ? d : []);
  }, [api, token]);

  useEffect(() => { load(); }, [load]);

  const empty = { title: '', message: '', type: 'info', is_active: 1 };
  
  const save = async () => {
    const h = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
    const url = editing?.id ? `${api}/api/admin/notifications/${editing.id}` : `${api}/api/admin/notifications`;
    const method = editing?.id ? 'PUT' : 'POST';
    await fetch(url, { method, headers: h, body: JSON.stringify(editing) });
    setEditing(null); load();
  };

  const remove = async (id) => {
    const h = { 'Authorization': `Bearer ${token}` };
    await fetch(`${api}/api/admin/notifications/${id}`, { method: 'DELETE', headers: h });
    load();
  };

  return (
    <div>
      <h1>🔔 Notifications ({notifs.length})</h1>
      <button onClick={() => setEditing(empty)} className="btn-primary">+ New Notification</button>
      {editing && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editing.id ? 'Edit' : 'New'} Notification</h2>
            <label>Title <input type="text" value={editing.title || ''} onChange={e => setEditing({...editing, title: e.target.value})} /></label>
            <label>Message <textarea rows="4" value={editing.message || ''} onChange={e => setEditing({...editing, message: e.target.value})} /></label>
            <label>Type 
              <select value={editing.type || 'info'} onChange={e => setEditing({...editing, type: e.target.value})}>
                <option value="info">ℹ️ Info</option>
                <option value="success">✅ Success</option>
                <option value="warning">⚠️ Warning</option>
                <option value="announcement">📢 Announcement</option>
              </select>
            </label>
            <label>Active <input type="checkbox" checked={editing.is_active} onChange={e => setEditing({...editing, is_active: e.target.checked ? 1 : 0})} /></label>
            <div className="btn-row"><button onClick={save} className="btn-primary">💾 Save</button><button onClick={() => setEditing(null)} className="btn-secondary">Cancel</button></div>
          </div>
        </div>
      )}
      <div className="list">
        {notifs.map(n => (
          <div key={n.id} className={`list-item ${n.type}`}>
            <div>
              <strong>{n.type === 'announcement' ? '📢' : n.type === 'warning' ? '⚠️' : n.type === 'success' ? '✅' : 'ℹ️'} {n.title}</strong>
              {!n.is_active && <span className="badge draft">Hidden</span>}
              <p>{n.message}</p>
              <small>{new Date(n.created_at).toLocaleString()}</small>
            </div>
            <div><button onClick={() => setEditing(n)}>✏️</button><button onClick={() => remove(n.id)}>🗑️</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}

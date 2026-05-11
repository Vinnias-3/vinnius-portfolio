import React, { useEffect, useState } from 'react';
export default function Guestbook({ api, token }) {
  const [items, setItems] = useState([]);
  const h = (extra = {}) => ({ 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', ...extra });
  const load = () => fetch(`${api}/api/admin/guestbook`, { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json()).then(setItems);
  useEffect(() => { load(); }, []);
  const toggle = async (id, approved) => { await fetch(`${api}/api/admin/guestbook/${id}`, { method: 'PUT', headers: h(), body: JSON.stringify({is_approved: approved?0:1}) }); load(); };
  const remove = async (id) => { await fetch(`${api}/api/admin/guestbook/${id}`, { method: 'DELETE', headers: h() }); load(); };
  return (
    <div><h1>💬 Guestbook ({items.length})</h1>
      <div className="list">{items.map(i => <div key={i.id} className={`list-item ${!i.is_approved ? 'unread' : ''}`}><div><strong>{i.visitor_name}</strong><p>{i.message}</p><small>{new Date(i.created_at).toLocaleString()}</small></div><div><button onClick={() => toggle(i.id, i.is_approved)}>{i.is_approved?'✅':'⏳ Approve'}</button><button onClick={() => remove(i.id)}>🗑️</button></div></div>)}</div></div>);
}

import React, { useEffect, useState } from 'react';

export default function Messages({ api, token }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const h = { 'Authorization': `Bearer ${token}` };
    fetch(`${api}/api/admin/messages`, { headers: h })
      .then(r => r.json())
      .then(d => setMessages(Array.isArray(d) ? d : []));
  }, [api, token]);

  const markRead = (id) => {
    const h = { 'Authorization': `Bearer ${token}` };
    fetch(`${api}/api/admin/messages/${id}/read`, { method: 'PUT', headers: h })
      .then(() => {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: 1 } : m));
      });
  };

  return (
    <div>
      <h1>Messages ({messages.length})</h1>
      <div className="list">
        {messages.map(m => (
          <div key={m.id} className={`list-item ${!m.is_read ? 'unread' : ''}`}>
            <div>
              <strong>{m.name}</strong> - {m.subject}<br />
              <small>{m.email} | {new Date(m.created_at).toLocaleString()}</small>
              <p>{m.message}</p>
            </div>
            <div>{!m.is_read && <button onClick={() => markRead(m.id)}>Read</button>}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

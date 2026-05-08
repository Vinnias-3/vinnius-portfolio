import React, { useEffect, useState } from 'react';

export default function Messages({ api, token }) {
  const [messages, setMessages] = useState([]);

  const load = // eslint-disable-next-line react-hooks/exhaustive-deps
  useCallback(async () => {
    const h = { 'Authorization': `Bearer ${token}` };
    const d = await fetch(`${api}/api/admin/messages`, { headers: h }).then(r => r.json());
    setMessages(Array.isArray(d) ? d : []);
  };

  useEffect(() => { load(); }, [token]); // eslint-disable-line

  const markRead = async (id) => {
    const h = { 'Authorization': `Bearer ${token}` };
    await fetch(`${api}/api/admin/messages/${id}/read`, { method: 'PUT', headers: h });
    load();
  };

  return (
    <div>
      <h1>📨 Messages ({messages.length})</h1>
      <div className="list">
        {messages.map(m => (
          <div key={m.id} className={`list-item ${!m.is_read ? 'unread' : ''}`}>
            <div>
              <strong>{m.name}</strong> — {m.subject}<br />
              <small>{m.email} | {new Date(m.created_at).toLocaleString()}</small>
              <p>{m.message}</p>
            </div>
            <div>{!m.is_read && <button onClick={() => markRead(m.id)}>✅ Read</button>}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
const API = 'http://localhost:5001/api/public';
export default function Guestbook() {
  const [messages, setMessages] = useState([]);
  const [form, setForm] = useState({ visitor_name: '', message: '' });
  const [sent, setSent] = useState(false);
  useEffect(() => { fetch(`${API}/guestbook`).then(r => r.json()).then(setMessages); }, [sent]);
  const submit = async (e) => {
    e.preventDefault();
    await fetch(`${API}/guestbook`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(form) });
    setSent(true); setForm({ visitor_name: '', message: '' });
    setTimeout(() => setSent(false), 3000);
  };
  return (
    <div className="page">
      <h1 className="page-title">💬 Guestbook</h1>
      <p className="page-subtitle">Leave a message. I'd love to hear from you!</p>
      <form onSubmit={submit} className="contact-form" style={{marginBottom:'30px'}}>
        <input type="text" placeholder="Your Name" required value={form.visitor_name} onChange={e => setForm({...form, visitor_name: e.target.value})} />
        <textarea placeholder="Your Message" rows="3" required value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
        <button type="submit" className="btn-primary">✈️ Send Message</button>
        {sent && <p style={{color:'#22c55e',marginTop:'10px'}}>✅ Message sent! It will appear after approval.</p>}
      </form>
      <div className="list">
        {messages.map(m => (
          <div key={m.id} className="list-item" style={{background:'#1e293b',padding:'15px',borderRadius:'10px',marginBottom:'8px'}}>
            <strong>{m.visitor_name}</strong>
            <p style={{color:'#94a3b8',marginTop:'5px'}}>{m.message}</p>
            <small style={{color:'#64748b'}}>{new Date(m.created_at).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

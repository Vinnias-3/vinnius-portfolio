import React, { useState } from 'react';

export default function Contact({ api }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('https://vinnius-portfolio-api.onrender.com/api/public/contact', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
    });
    setSent(true);
  };

  if (sent) return <div className="page"><h1 className="page-title">📧 Message Sent!</h1><p>I'll get back to you soon.</p></div>;

  return (
    <div className="page reveal">
      <h1 className="page-title kinetic-text">📧 Get In Touch</h1>
      <form onSubmit={handleSubmit} className="contact-form">
        <input type="text" placeholder="Your Name" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        <input type="email" placeholder="Your Email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        <input type="text" placeholder="Subject" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} />
        <textarea placeholder="Your Message" rows="6" required value={form.message} onChange={e => setForm({...form, message: e.target.value})}></textarea>
        <button type="submit" className="btn-primary magnetic">✈️ Send Message</button>
      </form>
    </div>
  );
}

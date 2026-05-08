import React, { useEffect, useState } from 'react';

export default function Dashboard({ api, token }) {
  const [stats, setStats] = useState({ projects: 0, skills: 0, messages: 0, unread: 0 });

  useEffect(() => {
    const load = async () => {
      const h = { 'Authorization': `Bearer ${token}` };
      const [p, s, m] = await Promise.all([
        fetch(`${api}/api/admin/projects`, { headers: h }).then(r => r.json()),
        fetch(`${api}/api/admin/skills`, { headers: h }).then(r => r.json()),
        fetch(`${api}/api/admin/messages`, { headers: h }).then(r => r.json()),
      ]);
      setStats({
        projects: Array.isArray(p) ? p.length : 0,
        skills: Array.isArray(s) ? s.length : 0,
        messages: Array.isArray(m) ? m.length : 0,
        unread: Array.isArray(m) ? m.filter(x => !x.is_read).length : 0
      });
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div>
      <h1>📊 Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card"><h2>{stats.projects}</h2><p>Projects</p></div>
        <div className="stat-card"><h2>{stats.skills}</h2><p>Skills</p></div>
        <div className="stat-card"><h2>{stats.messages}</h2><p>Messages</p></div>
        <div className="stat-card unread"><h2>{stats.unread}</h2><p>Unread</p></div>
      </div>
    </div>
  );
}

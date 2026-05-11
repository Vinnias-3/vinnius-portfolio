import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Projects from './pages/Projects';
import Skills from './pages/Skills';
import Notifications from './pages/Notifications';
import Messages from './pages/Messages';
import Library from './pages/Library';
import Posts from './pages/Posts';
import Feed from './pages/Feed';
import Resources from './pages/Resources';
import Events from './pages/Events';
import Timeline from './pages/Timeline';
import HallOfFame from './pages/HallOfFame';
import Guestbook from './pages/Guestbook';
import './App.css';

const API = 'http://localhost:5001';

function App() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('token');
    if (saved) {
      fetch(`${API}/api/admin/skills`, { headers: { 'Authorization': `Bearer ${saved}` } })
        .then(r => { if (r.status === 200) setToken(saved); else localStorage.removeItem('token'); setLoading(false); })
        .catch(() => { localStorage.removeItem('token'); setLoading(false); });
    } else setLoading(false);
  }, []);

  const login = (t) => { localStorage.setItem('token', t); setToken(t); };
  const logout = () => { localStorage.removeItem('token'); setToken(null); };
  if (loading) return <div className="login-page"><div className="login-form"><h1>Loading...</h1></div></div>;
  if (!token) return <Login onLogin={login} api={API} />;

  return (
    <BrowserRouter>
      <div className="admin-layout">
        <nav className="admin-nav">
          <h2>🛠️ Admin Kitchen</h2>
          <Link to="/">📊 Dashboard</Link>
          <Link to="/profile">👤 Profile</Link>
          <Link to="/projects">💼 Projects</Link>
          <Link to="/skills">🛠️ Skills</Link>
          <Link to="/library">📚 Library</Link>
          <Link to="/posts">📰 Posts</Link>
          <Link to="/feed">🎮 Feed</Link>
          <Link to="/resources">🛠️ Resources</Link>
          <Link to="/events">📅 Events</Link>
          <Link to="/timeline">🕒 Timeline</Link>
          <Link to="/halloffame">🏆 Hall of Fame</Link>
          <Link to="/notifications">🔔 Alerts</Link>
          <Link to="/guestbook">💬 Guestbook</Link>
          <Link to="/messages">📨 Messages</Link>
          <button onClick={logout} className="logout-btn">🚪 Logout</button>
        </nav>
        <main className="admin-content">
          <Routes>
            <Route path="/" element={<Dashboard api={API} token={token} />} />
            <Route path="/profile" element={<Profile api={API} token={token} />} />
            <Route path="/projects" element={<Projects api={API} token={token} />} />
            <Route path="/skills" element={<Skills api={API} token={token} />} />
            <Route path="/library" element={<Library api={API} token={token} />} />
            <Route path="/posts" element={<Posts api={API} token={token} />} />
            <Route path="/feed" element={<Feed api={API} token={token} />} />
            <Route path="/resources" element={<Resources api={API} token={token} />} />
            <Route path="/events" element={<Events api={API} token={token} />} />
            <Route path="/timeline" element={<Timeline api={API} token={token} />} />
            <Route path="/halloffame" element={<HallOfFame api={API} token={token} />} />
            <Route path="/notifications" element={<Notifications api={API} token={token} />} />
            <Route path="/guestbook" element={<Guestbook api={API} token={token} />} />
            <Route path="/messages" element={<Messages api={API} token={token} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
export default App;

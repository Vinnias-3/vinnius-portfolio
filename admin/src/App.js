import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Projects from './pages/Projects';
import Skills from './pages/Skills';
import Notifications from "./pages/Notifications";
import Messages from './pages/Messages';
import './App.css';

const API = 'https://vinnius-portfolio-api.onrender.com';

function App() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('token');
    if (saved) {
      // Verify token is still valid
      fetch(`${API}/api/admin/skills`, {
        headers: { 'Authorization': `Bearer ${saved}` }
      }).then(r => {
        if (r.status === 200) {
          setToken(saved);
        } else {
          localStorage.removeItem('token');
        }
        setLoading(false);
      }).catch(() => {
        localStorage.removeItem('token');
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = (t) => {
    localStorage.setItem('token', t);
    setToken(t);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

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
          <Link to="/notifications">🔔 Notifications</Link>
          <Link to="/messages">📨 Messages</Link>
          <button onClick={logout} className="logout-btn">🚪 Logout</button>
        </nav>
        <main className="admin-content">
          <Routes>
            <Route path="/" element={<Dashboard api={API} token={token} />} />
            <Route path="/profile" element={<Profile api={API} token={token} />} />
            <Route path="/projects" element={<Projects api={API} token={token} />} />
            <Route path="/skills" element={<Skills api={API} token={token} />} />
            <Route path="/notifications" element={<Notifications api={API} token={token} />} />
            <Route path="/messages" element={<Messages api={API} token={token} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

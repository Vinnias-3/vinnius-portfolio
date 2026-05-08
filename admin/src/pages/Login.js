import React, { useState } from 'react';

export default function Login({ onLogin, api }) {
  const [username, setUsername] = useState('vinnius');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${api}/api/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.token) onLogin(data.token);
      else setError(data.error || 'Login failed');
    } catch { setError('Cannot connect to server. Is Flask running?'); }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleLogin} className="login-form">
        <h1>🛠️ Admin Kitchen</h1>
        <p>Vinnius Portfolio Manager</p>
        {error && <div className="error">{error}</div>}
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">🔐 Login</button>
      </form>
    </div>
  );
}

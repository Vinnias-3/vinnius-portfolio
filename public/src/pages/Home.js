import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';

export default function Home({ profile, api, triggerEasterEgg }) {
  const [featured, setFeatured] = useState([]);
  const [currentTime, setCurrentTime] = useState('');
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const terminalRef = useRef(null);

  useEffect(() => {
    fetch(`${api}/projects?featured=1`).then(r => r.json()).then(setFeatured);
    setCurrentTime(new Date().toLocaleString());
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleString()), 1000);
    return () => clearInterval(timer);
  }, [api]);

  const executeCommand = (cmd) => {
    const trimmed = cmd.trim().toLowerCase();
    if (trimmed === 'matrix') {
      setHistory(prev => [...prev, { type: 'input', text: `guest@vinnius:~$ ${cmd}` }, { type: 'output', text: '🌧️ █ █ █ │ The Matrix has you...' }]);
      triggerEasterEgg('🕶️ Follow the white rabbit...');
    } else if (trimmed === 'coffee') {
      setHistory(prev => [...prev, { type: 'input', text: `guest@vinnius:~$ ${cmd}` }, { type: 'output', text: '☕ Coffee ready! Productivity +47%.' }]);
    } else {
      setHistory(prev => [...prev, { type: 'input', text: `guest@vinnius:~$ ${cmd}` }, { type: 'output', text: `Try 'matrix' or 'coffee' for surprises!` }]);
    }
    setInput('');
  };

  return (
    <div className="home">
      {/* Hero with Text Masking */}
      <section className="hero">
        <div className="hero-content reveal">
          <div className="avatar pulse magnetic" data-cursor="Hello!">{profile.profile_image_url ? <img src={profile.profile_image_url} alt={profile.full_name} className="profile-photo" /> : "🛡️"}</div>
          <h1 className="hero-name masked-text">
            <TypeAnimation sequence={[profile.full_name || 'Vinnius Mbuthia', 2000, 'Developer', 1500, 'AI Engineer', 1500]} wrapper="span" speed={50} repeat={Infinity} />
          </h1>
          <p className="hero-tagline">{profile.tagline || 'Developer & AI Engineer'}</p>
          <p className="hero-bio typewriter">{profile.bio}</p>
          <div className="hero-buttons">
            <Link to="/projects" className="btn-primary glow shimmer magnetic" data-cursor="View Work">💼 View Projects</Link>
            <a href="https://wa.me/254748702891" target="_blank" rel="noreferrer" className="btn-secondary shimmer-btn magnetic" data-cursor="Chat">💬 WhatsApp</a>
            <a href="mailto:techglobal824@gmail.com" className="btn-secondary shimmer-btn magnetic" data-cursor="Email">📧 Email</a>
          </div>
          <div className="hero-status"><span className="status-dot live"></span> Available • 📍 Kenya • 🕐 {currentTime}</div>
        </div>
      </section>

      {/* Bento Grid — About Me */}
      <section className="bento-section reveal">
        <h2 className="section-title">🧩 About Me</h2>
        <div className="bento-grid">
          <div className="bento-card large glass magnetic" data-cursor="Read More">
            <h3>👤 Who I Am</h3>
            <p>{profile.bio || 'Developer & AI Engineer building solutions for African communities.'}</p>
            <p className="bento-meta">{profile.mission}</p>
          </div>
          <div className="bento-card glass magnetic" data-cursor="Stats">
            <h3>📊 Quick Stats</h3>
            <div className="bento-stats">
              <span>5+ Projects</span><span>99.5% AI Accuracy</span>
              <span>3 Awards</span><span>500+ Training Images</span>
            </div>
          </div>
          <div className="bento-card glass magnetic" data-cursor="Contact">
            <h3>📧 Reach Me</h3>
            <p>techglobal824@gmail.com</p>
            <p>+254 748 702 891</p>
          </div>
          <div className="bento-card glass magnetic" data-cursor="Skills">
            <h3>🛠️ Top Skills</h3>
            <div className="bento-skills">
              <span>🐍 Python</span><span>🧠 AI/ML</span>
              <span>⚛️ React</span><span>🐧 Linux</span>
              <span>🗄️ SQL</span><span>📱 React Native</span>
            </div>
          </div>
        </div>
      </section>

      <NotificationsBanner api={api} />

      {/* Animated Marquee */}
      <div className="marquee">
        <div className="marquee-inner">
          <span>🚀 Python</span><span>🧠 AI/ML</span><span>⚛️ React</span><span>🐧 Linux</span><span>🗄️ SQL</span>
          <span>🔒 Cybersecurity</span><span>🌍 Flask</span><span>📱 React Native</span>
          <span>🚀 Python</span><span>🧠 AI/ML</span><span>⚛️ React</span><span>🐧 Linux</span>
        </div>
      </div>

      {/* Terminal */}
      <section className="terminal-section reveal glass">
        <div className="terminal-header">
          <span className="terminal-dot red"></span><span className="terminal-dot yellow"></span><span className="terminal-dot green"></span>
          <span className="terminal-title">guest@vinnius — Try: matrix, coffee</span>
        </div>
        <div className="terminal-body" ref={terminalRef}>
          <div className="terminal-welcome">
            <pre className="ascii-art">{`
 ██╗   ██╗██╗███╗   ██╗███╗   ██╗██╗██╗   ██╗███████╗
 ██║   ██║██║████╗  ██║████╗  ██║██║██║   ██║██╔════╝
 ██║   ██║██║██╔██╗ ██║██╔██╗ ██║██║██║   ██║███████╗
 ╚██╗ ██╔╝██║██║╚██╗██║██║╚██╗██║██║██║   ██║╚════██║
  ╚████╔╝ ██║██║ ╚████║██║ ╚████║██║╚██████╔╝███████║
   ╚═══╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═══╝╚═╝ ╚═════╝ ╚══════╝`}</pre>
          </div>
          {history.map((line, i) => (
            <div key={i} className={line.type === 'input' ? 'terminal-input' : 'terminal-output'}>
              {line.type === 'output' ? <pre>{line.text}</pre> : <span>{line.text}</span>}
            </div>
          ))}
          <div className="terminal-prompt">
            <span className="prompt">guest@vinnius:~$ </span>
            <input type="text" value={input} onChange={e => setInput(e.target.value)} 
              onKeyDown={e => { if (e.key === 'Enter' && input.trim()) executeCommand(input); }}
              className="terminal-input-field" autoFocus spellCheck={false} />
          </div>
        </div>
      </section>

      {/* Featured with Pexels */}
      {featured.length > 0 && (
        <section className="featured-section reveal">
          <h2 className="section-title">🌟 Featured Projects</h2>
          <div className="featured-grid">
            {featured.map((p, i) => (
              <FeaturedCard key={p.id} project={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Stats */}
      <section className="stats-section reveal">
        <div className="stat-item glass magnetic"><h2>5+</h2><p>Projects</p></div>
        <div className="stat-item glass magnetic"><h2>3</h2><p>Categories</p></div>
        <div className="stat-item glass magnetic"><h2>500+</h2><p>AI Images</p></div>
        <div className="stat-item glass magnetic"><h2>99.5%</h2><p>Accuracy</p></div>
      </section>

      <section className="cta-section glass reveal">
        <h2>🚀 Let's Build Something Amazing</h2>
        <p>Got a project idea? Need a developer?</p>
        <div className="cta-buttons">
          <a href="https://wa.me/254748702891" target="_blank" rel="noreferrer" className="btn-primary glow shimmer magnetic">💬 WhatsApp Me</a>
          <a href="mailto:techglobal824@gmail.com" className="btn-secondary shimmer-btn magnetic">📧 Send Email</a>
        </div>
      </section>
    </div>
  );
}

function FeaturedCard({ project, index }) {
  const [photos, setPhotos] = useState([]);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  useEffect(() => {
    fetch(`https://vinnias.pythonanywhere.com/api/public/pexels-images?query=${encodeURIComponent(project.category || 'technology')}&per_page=4`)
      .then(r => r.json()).then(d => setPhotos(d.slice(0, 4)));
  }, [project.category]);
  useEffect(() => {
    if (photos.length > 1) { const i = setInterval(() => setCurrentPhoto(p => (p + 1) % photos.length), 4000); return () => clearInterval(i); }
  }, [photos]);

  return (
    <Link to={`/projects/${project.slug}`} className="featured-card tilt magnetic reveal glass" data-cursor="View" style={{ animationDelay: `${index * 0.15}s` }}>
      <div className="featured-card-img">
        {photos.length > 0 ? (
          <div className="slideshow">
            {photos.map((p, i) => <img key={p.id} src={p.medium} alt={project.title} className={`slide ${i === currentPhoto ? 'active' : ''}`} />)}
            <div className="slide-dots">{photos.map((_, i) => <span key={i} className={`dot ${i === currentPhoto ? 'active' : ''}`} />)}</div>
            <span className="photo-credit">📸 {photos[currentPhoto]?.photographer}</span>
          </div>
        ) : <div className="placeholder-img">🚀</div>}
      </div>
      <h3>{project.title}</h3>
      <p>{project.short_description}</p>
      <span className="tech-tags">{project.technologies}</span>
    </Link>
  );
}

function NotificationsBanner({ api }) {
  const [notifs, setNotifs] = useState([]);
  useEffect(() => {
    fetch(`https://vinnias.pythonanywhere.com/api/public/notifications`)
      .then(r => r.json()).then(d => setNotifs(Array.isArray(d) ? d : []));
  }, [api]);

  if (notifs.length === 0) return null;

  return (
    <section className="notifications-banner reveal">
      {notifs.map(n => (
        <div key={n.id} className={`notif-item ${n.type}`}>
          <span className="notif-icon">
            {n.type === 'announcement' ? '📢' : n.type === 'warning' ? '⚠️' : n.type === 'success' ? '✅' : 'ℹ️'}
          </span>
          <div>
            <strong>{n.title}</strong>
            <p>{n.message}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

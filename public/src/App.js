import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Skills from './pages/Skills';
import About from './pages/About';
import Contact from './pages/Contact';
import Library from './pages/Library';
import Blog from './pages/Blog';
import Feed from './pages/Feed';
import Resources from './pages/Resources';
import Events from './pages/Events';
import Timeline from './pages/Timeline';
import HallOfFame from './pages/HallOfFame';
import Guestbook from './pages/Guestbook';
import './App.css';

const API = 'https://vinnias.pythonanywhere.com/api/public';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function App() {
  const [profile, setProfile] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorHover, setCursorHover] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [konami, setKonami] = useState(false);
  const [easterEgg, setEasterEgg] = useState('');
  const konamiCode = React.useRef([]);

  useEffect(() => {
    fetch(`${API}/profile`).then(r => r.json()).then(setProfile);
    
    // Custom cursor
    const moveCursor = (e) => { setCursorPos({ x: e.clientX, y: e.clientY }); };
    window.addEventListener('mousemove', moveCursor);
    
    // Konami code
    const handleKey = (e) => {
      konamiCode.current.push(e.key);
      konamiCode.current = konamiCode.current.slice(-10);
      if (konamiCode.current.join('') === 'ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightba') {
        setKonami(true); setTimeout(() => setKonami(false), 5000);
      }
    };
    window.addEventListener('keydown', handleKey);
    
    // Add hover listeners
    setTimeout(() => {
      document.querySelectorAll('a, button, .magnetic, .project-card, .featured-card, .skill-item').forEach(el => {
        el.addEventListener('mouseenter', () => { setCursorHover(true); setCursorText(el.dataset.cursor || ''); });
        el.addEventListener('mouseleave', () => { setCursorHover(false); setCursorText(''); });
      });
    }, 1500);
    
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('keydown', handleKey);
    };
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="app">
        <div className={`custom-cursor ${cursorHover ? 'hover' : ''}`} style={{ left: cursorPos.x, top: cursorPos.y }}>
          {cursorText && <span className="cursor-text">{cursorText}</span>}
        </div>
        {konami && <div className="konami-overlay"><div className="konami-content"><h1>🎮 CHEAT CODE ACTIVATED</h1><p>Unlimited skills unlocked.</p></div></div>}
        {easterEgg && <div className="easter-toast">{easterEgg}</div>}
        <div id="vanta-bg" className="vanta-background"></div>
        <div className="scroll-progress shimmer-bar" style={{ width: '0%' }}></div>

        <nav className="navbar">
          <Link to="/" className="nav-logo">🛡️ {profile.full_name || 'Vinnius'}</Link>
          <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/projects" onClick={() => setMenuOpen(false)}>Projects</Link>
            <Link to="/skills" onClick={() => setMenuOpen(false)}>Skills</Link>
            <Link to="/library" onClick={() => setMenuOpen(false)}>Library</Link>
            <Link to="/blog" onClick={() => setMenuOpen(false)}>Blog</Link>
            <Link to="/feed" onClick={() => setMenuOpen(false)}>Feed</Link>
            <Link to="/resources" onClick={() => setMenuOpen(false)}>Resources</Link>
            <Link to="/events" onClick={() => setMenuOpen(false)}>Events</Link>
            <Link to="/timeline" onClick={() => setMenuOpen(false)}>Timeline</Link>
            <Link to="/halloffame" onClick={() => setMenuOpen(false)}>Hall of Fame</Link>
            <Link to="/guestbook" onClick={() => setMenuOpen(false)}>Guestbook</Link>
            <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
          </div>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home profile={profile} api={API} />} />
            <Route path="/projects" element={<Projects api={API} />} />
            <Route path="/projects/:slug" element={<ProjectDetail api={API} />} />
            <Route path="/skills" element={<Skills api={API} />} />
            <Route path="/library" element={<Library />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/events" element={<Events />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/halloffame" element={<HallOfFame />} />
            <Route path="/guestbook" element={<Guestbook />} />
            <Route path="/about" element={<About profile={profile} />} />
            <Route path="/contact" element={<Contact api={API} />} />
          </Routes>
        </main>

        <footer className="footer">
          <div className="footer-grid">
            <div><h4>🛡️ {profile.full_name || 'Vinnius Mbuthia'}</h4><p>{profile.tagline}</p></div>
            <div><h4>📧 Contact</h4><p>📧 techglobal824@gmail.com</p><p>📱 +254 748 702 891</p></div>
            <div><h4>🔗 Links</h4><Link to="/projects">Projects</Link><Link to="/library">Library</Link><Link to="/blog">Blog</Link></div>
            <div><h4>🌐 Connect</h4><a href="https://wa.me/254748702891">💬 WhatsApp</a><a href="mailto:techglobal824@gmail.com">📧 Email</a></div>
          </div>
          <div className="footer-bottom"><p>© 2026 Built on Parrot OS. Powered by Linux & Caffeine</p></div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
export default App;

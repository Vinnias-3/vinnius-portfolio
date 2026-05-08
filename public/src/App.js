import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Skills from './pages/Skills';
import About from './pages/About';
import Contact from './pages/Contact';
import './App.css';

const API = 'http://localhost:5001/api/public';

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
  const [scrollProgress, setScrollProgress] = useState(0);
  const [konami, setKonami] = useState(false);
  const [easterEgg, setEasterEgg] = useState('');
  const konamiCode = useRef([]);

  useEffect(() => {
    fetch(`${API}/profile`).then(r => r.json()).then(setProfile);
    
    // Custom cursor
    const moveCursor = (e) => { setCursorPos({ x: e.clientX, y: e.clientY }); };
    window.addEventListener('mousemove', moveCursor);
    
    // Scroll progress
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Konami
    const handleKey = (e) => {
      konamiCode.current.push(e.key);
      konamiCode.current = konamiCode.current.slice(-10);
      if (konamiCode.current.join('') === 'ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightba') {
        setKonami(true); setTimeout(() => setKonami(false), 5000);
      }
    };
    window.addEventListener('keydown', handleKey);
    
    // Hover listeners for magnetic elements
    const addListeners = () => {
      document.querySelectorAll('a, button, .magnetic, .project-card, .featured-card, .skill-item, .bento-card').forEach(el => {
        el.addEventListener('mouseenter', () => { setCursorHover(true); setCursorText(el.dataset.cursor || ''); });
        el.addEventListener('mouseleave', () => { setCursorHover(false); setCursorText(''); });
      });
    };
    setTimeout(addListeners, 1500);
    
    // Initialize Lenis smooth scroll
    if (window.Lenis) {
      const lenis = new window.Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smooth: true });
      function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
    }
    
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKey);
    };
  }, []);

  const triggerEasterEgg = (msg) => { setEasterEgg(msg); setTimeout(() => setEasterEgg(''), 4000); };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="app">
        {/* Video background served by index.html */}
        <div className="scroll-progress shimmer-bar" style={{ width: `${scrollProgress}%` }}></div>
        
        <div className={`custom-cursor ${cursorHover ? 'hover' : ''}`} style={{ left: cursorPos.x, top: cursorPos.y }}>
          {cursorText && <span className="cursor-text">{cursorText}</span>}
        </div>

        <a href="https://wa.me/254748702891" target="_blank" rel="noreferrer" className="floating-whatsapp magnetic shimmer" data-cursor="Chat">💬</a>

        {konami && (
          <div className="konami-overlay">
            <div className="konami-content"><h1>🎮 CHEAT CODE ACTIVATED</h1><p>Unlimited skills unlocked.</p></div>
          </div>
        )}
        {easterEgg && <div className="easter-toast">{easterEgg}</div>}

        <nav className="navbar glass">
          <Link to="/" className="nav-logo magnetic" data-cursor="Home">🛡️ {profile.full_name || 'Vinnius'}</Link>
          <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
            {['Home','Projects','Skills','About','Contact'].map(item => (
              <Link key={item} to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="magnetic shimmer-btn" data-cursor={item} onClick={() => setMenuOpen(false)}>{item}</Link>
            ))}
          </div>
          <button className="menu-toggle magnetic" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home profile={profile} api={API} triggerEasterEgg={triggerEasterEgg} />} />
            <Route path="/projects" element={<Projects api={API} />} />
            <Route path="/projects/:slug" element={<ProjectDetail api={API} />} />
            <Route path="/skills" element={<Skills api={API} />} />
            <Route path="/about" element={<About profile={profile} />} />
            <Route path="/contact" element={<Contact api={API} />} />
          </Routes>
        </main>

        <footer className="footer glass">
          <div className="footer-grid">
            <div><h4>🛡️ {profile.full_name || 'Vinnius Mbuthia'}</h4><p>{profile.tagline}</p></div>
            <div><h4>📧 Contact</h4><p>📧 techglobal824@gmail.com</p><p>📱 +254 748 702 891</p></div>
            <div><h4>🔗 Links</h4><Link to="/projects">Projects</Link><Link to="/skills">Skills</Link></div>
            <div><h4>🌐 Connect</h4><a href="https://wa.me/254748702891">💬 WhatsApp</a><a href="mailto:techglobal824@gmail.com">📧 Email</a></div>
          </div>
          <div className="footer-bottom"><p>© {new Date().getFullYear()} Built on Parrot OS. Powered by Linux & Caffeine</p></div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;

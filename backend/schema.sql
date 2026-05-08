-- Vinnius Portfolio Database Schema
-- Admin writes here. Public reads from here.

CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL DEFAULT 'Vinnius Mbuthia',
    tagline TEXT DEFAULT 'Developer & AI Engineer',
    bio TEXT DEFAULT '',
    mission TEXT DEFAULT '',
    profile_image TEXT DEFAULT '',
    resume_url TEXT DEFAULT '',
    email TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    location TEXT DEFAULT '',
    github_url TEXT DEFAULT '',
    linkedin_url TEXT DEFAULT '',
    twitter_url TEXT DEFAULT '',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    percentage INTEGER DEFAULT 80,
    category TEXT DEFAULT 'Technical',
    icon TEXT DEFAULT '💻',
    demo_code TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    is_visible INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    short_description TEXT DEFAULT '',
    full_description TEXT DEFAULT '',
    category TEXT DEFAULT 'Web Development',
    thumbnail TEXT DEFAULT '',
    live_demo_url TEXT DEFAULT '',
    github_url TEXT DEFAULT '',
    technologies TEXT DEFAULT '',
    is_featured INTEGER DEFAULT 0,
    is_published INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS project_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    caption TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS terminal_commands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    command TEXT NOT NULL UNIQUE,
    response TEXT NOT NULL,
    is_hidden INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT DEFAULT '',
    message TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed default profile
INSERT OR IGNORE INTO profile (id, full_name, tagline, bio, mission) 
VALUES (1, 'Vinnius Mbuthia', 'Developer & AI Engineer', 
        'Diploma in Computer Science. Building AI solutions for African communities.',
        'Turning complex problems into working software that actually helps people.');

-- Seed default admin (password: admin123 — change immediately)
INSERT OR IGNORE INTO admins (id, username, password_hash) 
VALUES (1, 'vinnius', '$2b$12$LJ3m4ys3nGdKqZx8Yq5O6eJf7BkzQpXt0VfH8wYrCm2aN9sD4l1u');

-- Seed some starter terminal commands
INSERT OR IGNORE INTO terminal_commands (command, response, is_hidden) VALUES
('whois vinnius', 'Vinnius Mbuthia — Developer & AI Engineer. Diploma in Computer Science. Building AI for African communities.', 0),
('ls projects', '📁 EcoLens AI — Environmental early-warning platform\n📁 Database Q&A — 1000+ CDACC questions\n📁 Smart Dictionary — Multi-source lookup tool', 0),
('cat skills', '🐍 Python/Flask █████████░ 90%\n🧠 AI/ML ████████░░ 85%\n📱 React Native ███████░░░ 80%\n🐧 Linux ██████████ 95%', 0),
('help', 'Available commands: whois, ls, cat, run, ping, clear, help, neofetch, cowsay, sudo', 0),
('sudo rm -rf /', '😂 Nice try. This is not my first day with Linux.', 1),
('ping', 'Pong! 🏓 All systems operational.', 0),
('neofetch', 'OS: Parrot Security OS\nKernel: Linux 6.19\nShell: bash\nUptime: Since forever\nPackages: Too many to count', 0),
('cowsay hello', ' ________\n< hello! >\n --------\n        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||', 1);

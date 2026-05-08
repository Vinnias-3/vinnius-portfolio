"""
Vinnius Portfolio — Flask API Backend
Handles all CRUD for: profile, skills, projects, terminal commands, messages.
Admin panel writes. Public panel reads.
"""
import os, sqlite3, json
from datetime import datetime
from functools import wraps
from flask import Flask, request, jsonify, g
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import bcrypt
import requests
from functools import lru_cache

app = Flask(__name__)
app.config["SECRET_KEY"] = "ecolens-portfolio-fixed-secret-key-2026"
app.config["JWT_SECRET_KEY"] = "ecolens-jwt-fixed-secret-2026"
app.config["UPLOAD_FOLDER"] = os.path.join(os.path.dirname(__file__), "uploads")
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024
PEXELS_API_KEY = "lHGM8AiXqfFg4dXZA8QNPkWtB3pTVWwcqAuwSv8HA4lyoVIFQG0K3xoO"
PEXELS_CACHE = {}
CORS(app)
jwt = JWTManager(app)

os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)
DATABASE = os.path.join(os.path.dirname(__file__), "portfolio.db")

# ─── DATABASE ─────────────────────────────────────────────
def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(DATABASE)
        g.db.row_factory = sqlite3.Row
        g.db.execute("PRAGMA foreign_keys = ON")
    return g.db

@app.teardown_appcontext
def close_db(e):
    db = g.pop("db", None)
    if db: db.close()

def init_db():
    with app.app_context():
        db = get_db()
        with open(os.path.join(os.path.dirname(__file__), "schema.sql")) as f:
            db.executescript(f.read())
        db.commit()

def query(sql, params=(), one=False):
    db = get_db()
    cur = db.execute(sql, params)
    if one:
        row = cur.fetchone()
        return dict(row) if row else None
    return [dict(r) for r in cur.fetchall()]

def execute(sql, params=()):
    db = get_db()
    cur = db.execute(sql, params)
    db.commit()
    return cur.lastrowid

# ─── AUTH ──────────────────────────────────────────────────
@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data: return jsonify({"error": "JSON required"}), 400
    username = data.get("username")
    password = data.get("password")
    admin = query("SELECT * FROM admins WHERE username = ?", (username,), one=True)
    if not admin:
        return jsonify({"error": "Invalid credentials"}), 401
    if bcrypt.checkpw(password.encode(), admin["password_hash"].encode()):
        token = create_access_token(identity=username)
        return jsonify({"token": token, "success": True})
    return jsonify({"error": "Invalid credentials"}), 401

@app.route("/api/auth/change-password", methods=["POST"])
@jwt_required(optional=False)
def change_password():
    data = request.get_json()
    username = get_jwt_identity()
    new_hash = bcrypt.hashpw(data["new_password"].encode(), bcrypt.gensalt()).decode()
    execute("UPDATE admins SET password_hash = ? WHERE username = ?", (new_hash, username))
    return jsonify({"success": True, "message": "Password changed"})

# ─── PROFILE (Public Read + Admin Write) ────────────────────
@app.route("/api/public/profile", methods=["GET"])
def public_profile():
    profile = query("SELECT * FROM profile WHERE id = 1", one=True)
    return jsonify(profile)

@app.route("/api/admin/profile", methods=["PUT"])
@jwt_required(optional=False)
def update_profile():
    data = request.get_json()
    fields = ["full_name","tagline","bio","mission","profile_image_url","profile_image","resume_url",
              "cv_url","hero_headline","email","phone","location","github_url","linkedin_url","twitter_url"]
    updates = {k: data[k] for k in fields if k in data}
    if updates:
        set_clause = ", ".join(f"{k} = ?" for k in updates)
        execute(f"UPDATE profile SET {set_clause}, updated_at = CURRENT_TIMESTAMP WHERE id = 1", 
                list(updates.values()))
    return jsonify({"success": True})

# ─── SKILLS ────────────────────────────────────────────────
@app.route("/api/public/skills", methods=["GET"])
def public_skills():
    skills = query("SELECT * FROM skills WHERE is_visible = 1 ORDER BY sort_order")
    return jsonify(skills)

@app.route("/api/admin/skills", methods=["GET"])
@jwt_required(optional=False)
def admin_skills():
    return jsonify(query("SELECT * FROM skills ORDER BY sort_order"))

@app.route("/api/admin/skills", methods=["POST"])
@jwt_required(optional=False)
def add_skill():
    data = request.get_json()
    sid = execute(
        "INSERT INTO skills (name, percentage, category, icon, demo_code, sort_order) VALUES (?,?,?,?,?,?)",
        (data["name"], data.get("percentage",80), data.get("category","Technical"),
         data.get("icon","💻"), data.get("demo_code",""), data.get("sort_order",0))
    )
    return jsonify({"success": True, "id": sid})

@app.route("/api/admin/skills/<int:sid>", methods=["PUT"])
@jwt_required(optional=False)
def update_skill(sid):
    data = request.get_json()
    fields = ["name","percentage","category","icon","demo_code","sort_order","is_visible"]
    updates = {k: data[k] for k in fields if k in data}
    if updates:
        set_clause = ", ".join(f"{k} = ?" for k in updates)
        execute(f"UPDATE skills SET {set_clause} WHERE id = ?", list(updates.values()) + [sid])
    return jsonify({"success": True})

@app.route("/api/admin/skills/<int:sid>", methods=["DELETE"])
@jwt_required(optional=False)
def delete_skill(sid):
    execute("DELETE FROM skills WHERE id = ?", (sid,))
    return jsonify({"success": True})

# ─── PROJECTS ──────────────────────────────────────────────
@app.route("/api/public/projects", methods=["GET"])
def public_projects():
    featured = request.args.get("featured")
    sql = "SELECT * FROM projects WHERE is_published = 1"
    params = []
    if featured == "1":
        sql += " AND is_featured = 1"
    sql += " ORDER BY sort_order, created_at DESC"
    projects = query(sql, params)
    # Auto-attach Pexels images based on category
    for p in projects:
        if not p.get("images") or len(p.get("images",[])) == 0:
            p["pexels_query"] = p.get("category", "technology").replace("/", " ").replace("&", "and")
        p["images"] = p.get("images", [])
    for p in projects:
        p["images"] = query("SELECT * FROM project_images WHERE project_id = ? ORDER BY sort_order", (p["id"],))
    return jsonify(projects)

@app.route("/api/public/projects/<slug>", methods=["GET"])
def public_project_by_slug(slug):
    project = query("SELECT * FROM projects WHERE slug = ? AND is_published = 1", (slug,), one=True)
    if not project: return jsonify({"error": "Not found"}), 404
    project["images"] = query("SELECT * FROM project_images WHERE project_id = ? ORDER BY sort_order", (project["id"],))
    return jsonify(project)

@app.route("/api/admin/projects", methods=["GET"])
@jwt_required(optional=False)
def admin_projects():
    return jsonify(query("SELECT * FROM projects ORDER BY sort_order, created_at DESC"))

@app.route("/api/admin/projects", methods=["POST"])
@jwt_required(optional=False)
def add_project():
    data = request.get_json()
    slug = data.get("slug") or data["title"].lower().replace(" ","-").replace("/","-")
    pid = execute(
        """INSERT INTO projects (title, slug, short_description, full_description, category,
           thumbnail, live_demo_url, github_url, technologies, is_featured, is_published, sort_order)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?)""",
        (data["title"], slug, data.get("short_description",""), data.get("full_description",""),
         data.get("category","Web Development"), data.get("thumbnail",""), data.get("live_demo_url",""),
         data.get("github_url",""), data.get("technologies",""), data.get("is_featured",0),
         data.get("is_published",1), data.get("sort_order",0))
    )
    return jsonify({"success": True, "id": pid, "slug": slug})

@app.route("/api/admin/projects/<int:pid>", methods=["PUT"])
@jwt_required(optional=False)
def update_project(pid):
    data = request.get_json()
    fields = ["title","slug","short_description","full_description","category","thumbnail",
              "live_demo_url","github_url","technologies","is_featured","is_published","sort_order"]
    updates = {k: data[k] for k in fields if k in data}
    if updates:
        set_clause = ", ".join(f"{k} = ?" for k in updates)
        updates["updated_at"] = "CURRENT_TIMESTAMP"
        set_clause += ", updated_at = CURRENT_TIMESTAMP"
        execute(f"UPDATE projects SET {set_clause} WHERE id = ?", list(updates.values()) + [pid])
    return jsonify({"success": True})

@app.route("/api/admin/projects/<int:pid>", methods=["DELETE"])
@jwt_required(optional=False)
def delete_project(pid):
    execute("DELETE FROM projects WHERE id = ?", (pid,))
    return jsonify({"success": True})

# ─── PROJECT IMAGES ───────────────────────────────────────
@app.route("/api/admin/projects/<int:pid>/images", methods=["POST"])
@jwt_required(optional=False)
def add_project_image(pid):
    if "image" not in request.files:
        return jsonify({"error": "No image"}), 400
    file = request.files["image"]
    filename = secure_filename(f"{pid}_{datetime.now().strftime('%Y%m%d%H%M%S')}_{file.filename}")
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(filepath)
    img_id = execute("INSERT INTO project_images (project_id, image_url, caption) VALUES (?,?,?)",
                     (pid, f"/uploads/{filename}", request.form.get("caption","")))
    return jsonify({"success": True, "id": img_id, "url": f"/uploads/{filename}"})

@app.route("/api/admin/projects/<int:pid>/images/<int:iid>", methods=["DELETE"])
@jwt_required(optional=False)
def delete_project_image(pid, iid):
    img = query("SELECT image_url FROM project_images WHERE id = ? AND project_id = ?", (iid, pid), one=True)
    if img:
        filepath = os.path.join(os.path.dirname(__file__), img["image_url"].lstrip("/"))
        if os.path.exists(filepath): os.remove(filepath)
        execute("DELETE FROM project_images WHERE id = ?", (iid,))
    return jsonify({"success": True})

# ─── TERMINAL COMMANDS ────────────────────────────────────
@app.route("/api/public/terminal", methods=["GET"])
def public_terminal():
    cmds = query("SELECT command, response FROM terminal_commands WHERE is_hidden = 0")
    return jsonify(cmds)

@app.route("/api/admin/terminal", methods=["GET"])
@jwt_required(optional=False)
def admin_terminal():
    return jsonify(query("SELECT * FROM terminal_commands ORDER BY id"))

@app.route("/api/admin/terminal", methods=["POST"])
@jwt_required(optional=False)
def add_terminal_command():
    data = request.get_json()
    cid = execute("INSERT INTO terminal_commands (command, response, is_hidden) VALUES (?,?,?)",
                  (data["command"], data["response"], data.get("is_hidden", 0)))
    return jsonify({"success": True, "id": cid})

@app.route("/api/admin/terminal/<int:cid>", methods=["PUT"])
@jwt_required(optional=False)
def update_terminal_command(cid):
    data = request.get_json()
    fields = ["command","response","is_hidden"]
    updates = {k: data[k] for k in fields if k in data}
    if updates:
        set_clause = ", ".join(f"{k} = ?" for k in updates)
        execute(f"UPDATE terminal_commands SET {set_clause} WHERE id = ?", list(updates.values()) + [cid])
    return jsonify({"success": True})

@app.route("/api/admin/terminal/<int:cid>", methods=["DELETE"])
@jwt_required(optional=False)
def delete_terminal_command(cid):
    execute("DELETE FROM terminal_commands WHERE id = ?", (cid,))
    return jsonify({"success": True})

# ─── MESSAGES ──────────────────────────────────────────────
@app.route("/api/public/contact", methods=["POST"])
def submit_contact():
    data = request.get_json()
    execute("INSERT INTO messages (name, email, subject, message) VALUES (?,?,?,?)",
            (data["name"], data["email"], data.get("subject",""), data["message"]))
    return jsonify({"success": True, "message": "Message sent!"})

@app.route("/api/admin/messages", methods=["GET"])
@jwt_required(optional=False)
def admin_messages():
    return jsonify(query("SELECT * FROM messages ORDER BY created_at DESC"))

@app.route("/api/admin/messages/<int:mid>/read", methods=["PUT"])
@jwt_required(optional=False)
def mark_read(mid):
    execute("UPDATE messages SET is_read = 1 WHERE id = ?", (mid,))
    return jsonify({"success": True})

# ─── FILE UPLOADS (Images) ─────────────────────────────────
@app.route("/uploads/<filename>")
def uploaded_file(filename):
    from flask import send_from_directory
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

# ─── HEALTH ────────────────────────────────────────────────

@app.route("/api/public/pexels-images", methods=["GET"])
def pexels_images():
    """Proxy Pexels API — fetches beautiful stock photos based on query."""
    query = request.args.get("query", "technology")
    per_page = request.args.get("per_page", 5)
    cache_key = f"{query}_{per_page}"
    
    if cache_key in PEXELS_CACHE:
        return jsonify(PEXELS_CACHE[cache_key])
    
    try:
        resp = requests.get(
            "https://api.pexels.com/v1/search",
            headers={"Authorization": PEXELS_API_KEY},
            params={"query": query, "per_page": per_page, "orientation": "landscape", "size": "medium"},
            timeout=10
        )
        if resp.status_code == 200:
            data = resp.json()
            photos = [{
                "id": p["id"],
                "url": p["src"]["large"],
                "medium": p["src"]["medium"],
                "photographer": p["photographer"],
                "photographer_url": p["photographer_url"],
                "alt": p.get("alt", query)
            } for p in data.get("photos", [])]
            PEXELS_CACHE[cache_key] = photos
            return jsonify(photos)
        return jsonify([])
    except Exception as e:
        return jsonify({"error": str(e), "photos": []})


# ─── NOTIFICATIONS ──────────────────────────────────────────
@app.route("/api/public/notifications", methods=["GET"])
def public_notifications():
    notifs = query("SELECT * FROM notifications WHERE is_active = 1 ORDER BY created_at DESC LIMIT 10")
    return jsonify(notifs)

@app.route("/api/admin/notifications", methods=["GET"])
@jwt_required(optional=False)
def admin_notifications():
    return jsonify(query("SELECT * FROM notifications ORDER BY created_at DESC"))

@app.route("/api/admin/notifications", methods=["POST"])
@jwt_required(optional=False)
def add_notification():
    data = request.get_json()
    nid = execute(
        "INSERT INTO notifications (title, message, type, is_active) VALUES (?,?,?,?)",
        (data["title"], data["message"], data.get("type","info"), data.get("is_active",1))
    )
    return jsonify({"success": True, "id": nid})

@app.route("/api/admin/notifications/<int:nid>", methods=["PUT"])
@jwt_required(optional=False)
def update_notification(nid):
    data = request.get_json()
    fields = ["title","message","type","is_active"]
    updates = {k: data[k] for k in fields if k in data}
    if updates:
        set_clause = ", ".join(f"{k} = ?" for k in updates)
        execute(f"UPDATE notifications SET {set_clause} WHERE id = ?", list(updates.values()) + [nid])
    return jsonify({"success": True})

@app.route("/api/admin/notifications/<int:nid>", methods=["DELETE"])
@jwt_required(optional=False)
def delete_notification(nid):
    execute("DELETE FROM notifications WHERE id = ?", (nid,))
    return jsonify({"success": True})

@app.route("/api/health")
def health():
    return jsonify({"status": "operational", "service": "Vinnius Portfolio API", "version": "1.0.0"})

if __name__ == "__main__":
    init_db()
    app.run(host="0.0.0.0", port=5001, debug=True)

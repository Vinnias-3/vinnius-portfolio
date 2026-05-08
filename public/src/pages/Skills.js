import React, { useEffect, useState } from 'react';

export default function Skills({ api }) {
  const [skills, setSkills] = useState([]);
  useEffect(() => { fetch(`${api}/skills`).then(r => r.json()).then(setSkills); }, [api]);
  const categories = [...new Set(skills.map(s => s.category))];

  return (
    <div className="page">
      <h1 className="page-title kinetic-text reveal">🛠️ Skills</h1>
      <p className="page-subtitle reveal">What I bring to every project.</p>
      {categories.map(cat => (
        <div key={cat} className="skill-category reveal">
          <h2 className="category-title">{cat}</h2>
          <div className="skills-list">
            {skills.filter(s => s.category === cat).map(s => (
              <div key={s.id} className="skill-item magnetic" data-cursor={s.name}>
                <div className="skill-header">
                  <span className="skill-icon">{s.icon}</span>
                  <span className="skill-name">{s.name}</span>
                  <span className="skill-percent">{s.percentage}%</span>
                </div>
                <div className="skill-bar"><div className="skill-fill" style={{ width: `${s.percentage}%` }}></div></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

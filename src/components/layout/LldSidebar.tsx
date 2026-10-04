import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { lldModules } from '../../content/lld/index.ts';
import './LldSidebar.css';

export default function LldSidebar() {
  // location unused – keep for possible future nav state
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [completion, setCompletion] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem('lld-completion');
    if (saved) setCompletion(JSON.parse(saved));
  }, []);

  const toggleModule = (slug: string) => {
    setExpandedModules(prev => ({ ...prev, [slug]: !prev[slug] }));
  };

  const toggleTopic = (moduleSlug: string, topicSlug: string) => {
    const newCompletion = { 
      ...completion, 
      [`${moduleSlug}:${topicSlug}`]: !completion[`${moduleSlug}:${topicSlug}`] 
    };
    setCompletion(newCompletion);
    localStorage.setItem('lld-completion', JSON.stringify(newCompletion));
  };

  const isModuleComplete = (moduleSlug: string) => {
    const module = lldModules.find(m => m.slug === moduleSlug);
    if (!module) return false;
    return module.topics.every(t => completion[`${moduleSlug}:${t.slug}`]);
  };

  return (
    <aside className="lld-sidebar">
      <div className="lld-sidebar-header">
        <h3>LLD Curriculum</h3>
      </div>
      <div className="lld-sidebar-scroll">
        {lldModules.map((module) => (
          <div key={module.slug} className="lld-module-group">
            <button 
              className={`lld-module-toggle ${expandedModules[module.slug] ? 'expanded' : ''}`}
              onClick={() => toggleModule(module.slug)}
            >
              <span className="toggle-icon"></span>
              <span className="module-title">{module.title}</span>
              <input 
                type="checkbox" 
                checked={isModuleComplete(module.slug)} 
                readOnly 
                className="module-completion-check"
              />
            </button>
            
            {expandedModules[module.slug] && (
              <ul className="lld-topic-list">
                {module.topics.map((topic) => (
                  <li key={topic.slug} className="lld-topic-item">
                    <NavLink 
                      to={`/lld/${module.slug}/${topic.slug}`}
                      className={({ isActive }) => `lld-topic-link ${isActive ? 'active' : ''}`}
                    >
                      {topic.title}
                    </NavLink>
                    <input 
                      type="checkbox" 
                      checked={!!completion[`${module.slug}:${topic.slug}`]} 
                      onChange={() => toggleTopic(module.slug, topic.slug)}
                      className="topic-completion-check"
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}

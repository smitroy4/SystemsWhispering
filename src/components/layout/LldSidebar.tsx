import { useEffect, useState } from 'react';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import { lldModules } from '../../content/lld/index.ts';
import './LldSidebar.css';

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

/**
 * Premium LLD curriculum sidebar: numbered modules with expandable
 * topic lists. The module holding the current topic opens automatically.
 */
export default function LldSidebar() {
  const location = useLocation();
  const params = useParams<{ module?: string }>();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (params.module) {
      setExpanded((prev) =>
        prev[params.module as string] ? prev : { ...prev, [params.module as string]: true },
      );
    }
  }, [params.module, location.pathname]);

  const toggleModule = (slug: string) => {
    setExpanded((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  return (
    <aside className="lld-sidebar" aria-label="LLD curriculum">
      <div className="lld-sidebar__head">
        <h2 className="lld-sidebar__title">LLD Curriculum</h2>
        <span className="lld-sidebar__count" aria-label={`${lldModules.length} modules`}>
          {lldModules.length}
        </span>
      </div>
      <div className="lld-sidebar__groups">
        {lldModules.map((module) => {
          const open = !!expanded[module.slug];
          return (
            <div key={module.slug} className="lld-sidebar__group">
              <button
                type="button"
                className={`lld-sidebar__module${open ? ' lld-sidebar__module--open' : ''}`}
                aria-expanded={open}
                onClick={() => toggleModule(module.slug)}
              >
                <span className="lld-sidebar__order" aria-hidden="true">
                  {pad(module.order)}
                </span>
                <span className="lld-sidebar__name">{module.title}</span>
                <span className="lld-sidebar__topics" aria-hidden="true">
                  {module.topics.length}
                </span>
                <span className="lld-sidebar__chev" aria-hidden="true" />
              </button>
              {open ? (
                <ol className="lld-sidebar__topics-list">
                  {module.topics.map((topic) => (
                    <li key={topic.slug} className="lld-sidebar__topic">
                      <NavLink
                        to={`/lld/${module.slug}/${topic.slug}`}
                        className={({ isActive }) =>
                          `lld-sidebar__link${isActive ? ' lld-sidebar__link--active' : ''}`
                        }
                      >
                        <span className="lld-sidebar__index" aria-hidden="true">
                          {pad(topic.order)}
                        </span>
                        {topic.title}
                      </NavLink>
                    </li>
                  ))}
                </ol>
              ) : null}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

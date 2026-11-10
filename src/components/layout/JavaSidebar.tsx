import { useEffect, useState } from 'react';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import { javaModules } from '../../content/java/index.ts';
import './JavaSidebar.css';

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

export default function JavaSidebar() {
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

  /** Always show every module so a visitor can jump between modules from any
   * topic page. The current module (when inside a topic) is auto-expanded. */
  const modules = javaModules;

  const toggleModule = (slug: string) => {
    setExpanded((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  return (
    <aside className="java-sidebar" aria-label="Java curriculum">
      <div className="java-sidebar__head">
        <h2 className="java-sidebar__title">Java: The Backbone</h2>
        <span className="java-sidebar__count" aria-label={`${modules.length} modules`}>
          {modules.length}
        </span>
      </div>
      <div className="java-sidebar__groups">
        {modules.map((module) => {
          const open = !!expanded[module.slug];
          return (
            <div key={module.slug} className="java-sidebar__group">
              <button
                type="button"
                className={`java-sidebar__module${open ? ' java-sidebar__module--open' : ''}`}
                aria-expanded={open}
                onClick={() => toggleModule(module.slug)}
              >
                <span className="java-sidebar__order" aria-hidden="true">
                  {pad(module.order)}
                </span>
                <span className="java-sidebar__name">{module.title}</span>
                <span className="java-sidebar__topics" aria-hidden="true">
                  {module.topics.length}
                </span>
                <span className="java-sidebar__chev" aria-hidden="true" />
              </button>
              {open ? (
                <ol className="java-sidebar__topics-list">
                  {module.topics.map((topic) => (
                    <li key={topic.slug} className="java-sidebar__topic">
                      <NavLink
                        to={`/java/${module.slug}/${topic.slug}`}
                        className={({ isActive }) =>
                          `java-sidebar__link${isActive ? ' java-sidebar__link--active' : ''}`
                        }
                      >
                        <span className="java-sidebar__index" aria-hidden="true">
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
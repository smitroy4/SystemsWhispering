import { Link } from 'react-router-dom';
import { PageShell } from '../components/layout/index.ts';
import { usePageMeta } from '../utils/pageMeta.ts';
import { lldModules } from '../content/lld/index.ts';
import LldSidebar from '../components/layout/LldSidebar.tsx';
import './LldPages.css';

/** LLD index: module cards with topic counts, sidebar carries the full tree. */
export default function LldPage() {
  usePageMeta(
    'Low-Level Design',
    'Systems Whispering — Low-Level Design for Java developers: software design foundations, OOP, SOLID principles, and design patterns.',
  );

  return (
    <PageShell
      title="Low-Level Design"
      description="Object-oriented design, SOLID principles, and design patterns in Java — one module at a time."
      sidebar={<LldSidebar />}
    >
      <div className="lld-module-grid">
        {lldModules.map((module) => {
          const first = module.topics[0];
          return (
            <Link
              key={module.slug}
              to={first ? `/lld/${module.slug}/${first.slug}` : '/lld'}
              className="lld-module-card"
            >
              <p className="lld-module-card__order">Module {module.order}</p>
              <h2 className="lld-module-card__title">{module.title}</h2>
              <p className="lld-module-card__summary">{module.summary}</p>
              <p className="lld-module-card__meta">
                {module.topics.length} {module.topics.length === 1 ? 'topic' : 'topics'} →
              </p>
            </Link>
          );
        })}
      </div>
    </PageShell>
  );
}

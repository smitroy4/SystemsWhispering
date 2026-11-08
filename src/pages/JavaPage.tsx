import { Link } from 'react-router-dom';
import { PageShell } from '../components/layout/index.ts';
import { usePageMeta } from '../utils/pageMeta.ts';
import { javaModules } from '../content/java/index.ts';
import JavaSidebar from '../components/layout/JavaSidebar.tsx';
import './JavaPages.css';

/** Java landing page: module cards that open the first topic of each module. */
export default function JavaPage() {
  usePageMeta(
    'Java: The Backbone',
    'Systems Whispering — Java: The Backbone. From fundamentals to multithreading, one module at a time.',
  );

  return (
    <PageShell
      title="Java: The Backbone"
      description="Core Java, one module at a time — fundamentals, OOP, collections & streams, exceptions & memory, and multithreading."
      sidebar={<JavaSidebar />}
    >
      <div className="java-module-grid">
        {javaModules.map((module) => {
          const first = module.topics[0];
          return (
            <Link
              key={module.slug}
              to={first ? `/java/${module.slug}/${first.slug}` : '/java'}
              className="java-module-card"
            >
              <p className="java-module-card__order">Module {module.order}</p>
              <h2 className="java-module-card__title">{module.title}</h2>
              <p className="java-module-card__summary">{module.overview}</p>
              <p className="java-module-card__meta">
                {module.topics.length} {module.topics.length === 1 ? 'topic' : 'topics'} →
              </p>
            </Link>
          );
        })}
      </div>
    </PageShell>
  );
}
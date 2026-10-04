import { Link, useParams } from 'react-router-dom';
import { PageShell } from '../components/layout/index.ts';
import { usePageMeta } from '../utils/pageMeta.ts';
import { getLldModule } from '../content/lld/index.ts';
import LldSidebar from '../components/layout/LldSidebar.tsx';

export default function LldModulePage() {
  const { module: moduleSlug } = useParams<{ module: string }>();
  const module = getLldModule(moduleSlug ?? '');

  if (!module) {
    return (
      <PageShell title="Module Not Found">
        <div className="placeholder">
          <h1>Module Not Found</h1>
          <Link to="/lld">Back to LLD Overview</Link>
        </div>
      </PageShell>
    );
  }

  usePageMeta(
    module.title,
    `Systems Whispering — ${module.title}. Explore topics in this module.`,
  );

  return (
    <PageShell
      title={module.title}
      description={module.summary}
      sidebar={<LldSidebar />}
    >
      <div className="lld-module-content">
        <div className="breadcrumb">
          <Link to="/lld">LLD</Link> / {module.title}
        </div>
        
        <div className="topic-grid">
          {module.topics.map((topic) => (
            <Link 
              key={topic.slug} 
              to={`/lld/${module.slug}/${topic.slug}`}
              className="topic-card"
            >
              <div className="topic-header">
                <span className="topic-order">{topic.order}</span>
                <h3>{topic.title}</h3>
              </div>
              <p>{topic.summary}</p>
            </Link>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

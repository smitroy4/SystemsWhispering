import { Link, useParams } from 'react-router-dom';
import { PageShell } from '../components/layout/index.ts';
import { usePageMeta } from '../utils/pageMeta.ts';

/** Placeholder topic page for the isolated Low-Level Design module. */
export default function LldTopicPage() {
  const { module, topic } = useParams<{ module: string; topic: string }>();

  usePageMeta(
    topic ?? 'Low-Level Design topic',
    'Systems Whispering — Low-Level Design for Java developers. Content landing soon.',
  );

  return (
    <PageShell
      title={topic ?? 'Topic'}
      description={`Module: ${module ?? 'unknown'} — content landing soon.`}
    >
      <div className="placeholder">
        <h1>
          LLD{module ? `: ${module}` : ''}
          {topic ? ` / ${topic}` : ''} — placeholder
        </h1>
        <p>
          Back to <Link to="/lld">Low-Level Design</Link> or{' '}
          <Link to="/">home</Link>.
        </p>
      </div>
    </PageShell>
  );
}

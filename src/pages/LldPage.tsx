import { Link } from 'react-router-dom';
import { PageShell } from '../components/layout/index.ts';
import { usePageMeta } from '../utils/pageMeta.ts';

/** Placeholder index for the isolated Low-Level Design module. */
export default function LldPage() {
  usePageMeta(
    'Low-Level Design',
    'Systems Whispering — Low-Level Design for Java developers. Modules landing soon.',
  );

  return (
    <PageShell
      title="Low-Level Design"
      description="Object-oriented design, SOLID, and design patterns in Java — modules landing soon."
    >
      <div className="placeholder">
        <h1>LLD — placeholder</h1>
        <p>
          Low-Level Design lives here as an isolated module. Back{' '}
          <Link to="/">home</Link>.
        </p>
      </div>
    </PageShell>
  );
}

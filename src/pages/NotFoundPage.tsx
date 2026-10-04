import { Link } from 'react-router-dom';
import { PageShell } from '../components/layout/index.ts';
import { usePageMeta } from '../utils/pageMeta.ts';

export default function NotFoundPage() {
  usePageMeta('Page not found', 'This page does not exist.');
  return (
    <PageShell title="Page not found" description="This page does not exist.">
      <div className="placeholder">
        <h1>404 — nothing here</h1>
        <p>
          The link may be broken or the page may have moved. Go back{' '}
          <Link to="/">home</Link> or browse the{' '}
          <Link to="/data-structures">data structures</Link>,{' '}
          <Link to="/algorithms">algorithms</Link>, and{' '}
          <Link to="/concepts">concepts</Link> indexes.
        </p>
      </div>
    </PageShell>
  );
}

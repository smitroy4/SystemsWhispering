import { Link } from 'react-router-dom';
import { PageShell } from '../components/layout/index.ts';
import { sheets } from '../content/sheets/index.ts';
import { useSheetProgress } from '../utils/sheetProgress.ts';
import { usePageMeta } from '../utils/pageMeta.ts';
import './SheetsPage.css';

function SheetCard({ slug, title, description, days }: { slug: string; title: string; description: string; days: number }) {
  const { completed } = useSheetProgress(slug);
  const percent = days === 0 ? 0 : Math.round((completed.size / days) * 100);

  return (
    <article className="sheet-card">
      <h2 className="sheet-card__title">
        <Link to={`/sheets/${slug}`}>{title}</Link>
      </h2>
      <p className="sheet-card__meta">
        {days} days
        {completed.size > 0 ? ` · ${completed.size}/${days} done (${percent}%)` : ''}
      </p>
      <p className="sheet-card__desc">{description}</p>
      <div
        className="sheet-card__bar"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={days}
        aria-valuenow={completed.size}
        aria-label={`${title} progress`}
      >
        <div className="sheet-card__fill" style={{ width: `${percent}%` }} />
      </div>
      <Link className="sheet-card__cta" to={`/sheets/${slug}`}>
        {completed.size === 0 ? 'Start plan →' : 'Continue plan →'}
      </Link>
    </article>
  );
}

export default function SheetsPage() {
  usePageMeta('Study Sheets', 'Guided study plans and roadmaps. Your per-day progress saves in your browser.');
  return (
    <PageShell
      title="Sheets"
      description="Guided study plans and roadmaps. Your per-day progress saves in your browser."
    >
      <div className="sheet-grid">
        {sheets.map((sheet) => (
          <SheetCard
            key={sheet.slug}
            slug={sheet.slug}
            title={sheet.title}
            description={sheet.description}
            days={sheet.days.length}
          />
        ))}
      </div>
    </PageShell>
  );
}

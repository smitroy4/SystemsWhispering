import { Link } from 'react-router-dom';
import { PageShell } from '../components/layout/index.ts';
import { Badge } from '../components/ui/index.ts';
import type { SheetDifficulty } from '../types/content.ts';
import { sheets } from '../content/sheets/index.ts';
import { useSheetProgress } from '../utils/sheetProgress.ts';
import { usePageMeta } from '../utils/pageMeta.ts';
import './SheetsPage.css';

function difficultyTone(difficulty: SheetDifficulty): 'success' | 'warning' | 'danger' | 'info' {
  if (difficulty === 'Beginner') return 'success';
  if (difficulty === 'Intermediate') return 'warning';
  if (difficulty === 'Advanced') return 'danger';
  return 'info';
}

function countSheetStats(sheet: { days: { topicSlugs: string[]; problemIds: string[] }[] }) {
  const topicSet = new Set<string>();
  const problemSet = new Set<string>();
  for (const day of sheet.days) {
    for (const t of day.topicSlugs) topicSet.add(t);
    for (const p of day.problemIds) problemSet.add(p);
  }
  return { topicCount: topicSet.size, problemCount: problemSet.size };
}

function SheetCard({ slug, title, description, difficulty, days, topicCount, problemCount }: { slug: string; title: string; description: string; difficulty: SheetDifficulty; days: number; topicCount: number; problemCount: number }) {
  const { completed } = useSheetProgress(slug);
  const percent = days === 0 ? 0 : Math.round((completed.size / days) * 100);

  return (
    <article className="sheet-card">
      <h2 className="sheet-card__title">
        <Link to={`/sheets/${slug}`}>{title}</Link>
      </h2>
      <p className="sheet-card__meta">
        Topics: {topicCount} · Problems: {problemCount}
      </p>
      <p className="sheet-card__meta">
        <Badge tone={difficultyTone(difficulty)}>{difficulty}</Badge>
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
        {completed.size === 0 ? 'Start →' : 'Continue →'}
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
        {sheets.map((sheet) => {
          const stats = countSheetStats(sheet);
          return (
            <SheetCard
              key={sheet.slug}
              slug={sheet.slug}
              title={sheet.title}
              description={sheet.description}
              difficulty={sheet.difficulty}
              days={sheet.days.length}
              topicCount={stats.topicCount}
              problemCount={stats.problemCount}
            />
          );
        })}
      </div>
    </PageShell>
  );
}

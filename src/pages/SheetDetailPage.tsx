import { Link, useParams } from 'react-router-dom';import { PageShell } from '../components/layout/index.ts';
import { getSheet } from '../content/sheets/index.ts';
import { findTopicBySlug, getProblem } from '../utils/content.ts';
import { useSheetProgress } from '../utils/sheetProgress.ts';
import { usePageMeta } from '../utils/pageMeta.ts';
import './SheetsPage.css';

function countSheetStats(sheet: { days: { topicSlugs: string[]; problemIds: string[] }[] }) {
  const topicSet = new Set<string>();
  const problemSet = new Set<string>();
  for (const day of sheet.days) {
    for (const t of day.topicSlugs) topicSet.add(t);
    for (const p of day.problemIds) problemSet.add(p);
  }
  return { topicCount: topicSet.size, problemCount: problemSet.size };
}

export default function SheetDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const sheet = slug ? getSheet(slug) : undefined;
  const { completed, toggleDay } = useSheetProgress(slug ?? '');

  usePageMeta(
    sheet ? sheet.title : 'Sheet not found',
    sheet?.description ?? 'This study plan does not exist.',
  );

  if (!sheet) {
    return (
      <PageShell title="Sheet not found" description="This study plan does not exist.">
        <p>
          <Link to="/sheets">Back to all sheets</Link>.
        </p>
      </PageShell>
    );
  }

  const stats = countSheetStats(sheet);
  const total = sheet.days.length;
  const doneDays = sheet.days.filter((day) => completed.has(day.day));
  const doneCount = doneDays.length;
  const percent = total === 0 ? 0 : Math.round((doneCount / total) * 100);
  const topicProgress = new Set(doneDays.flatMap((day) => day.topicSlugs)).size;
  const problemProgress = new Set(doneDays.flatMap((day) => day.problemIds)).size;
  const nextDay = sheet.days.find((day) => !completed.has(day.day));

  const scrollToDay = (day: number) => {
    document.getElementById(`sheet-day-${day}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <PageShell title={sheet.title} description={sheet.description}>
      <section className="sheet-progress" aria-label="Sheet progress">
        <div className="sheet-progress__head">
          <strong>
            {doneCount} / {total} days ({percent}%)
          </strong>
          {nextDay ? (
            <button type="button" onClick={() => scrollToDay(nextDay.day)}>
              Continue from day {nextDay.day} →
            </button>
          ) : (
            <span>Complete — nicely done!</span>
          )}
        </div>
        <div className="sheet-progress__metrics">
          <span>Topics: {topicProgress} / {stats.topicCount}</span>
          <span>Problems: {problemProgress} / {stats.problemCount}</span>
        </div>
        <div
          className="sheet-progress__bar"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={doneCount}
          aria-label={`${sheet.title} progress`}
        >
          <div className="sheet-progress__fill" style={{ width: `${percent}%` }} />
        </div>
      </section>

      <ol className="sheet-timeline">
        {sheet.days.map((day) => {
          const isDone = completed.has(day.day);
          return (
            <li
              key={day.day}
              id={`sheet-day-${day.day}`}
              className={`sheet-day${isDone ? ' is-done' : ''}`}
            >
              <div className="sheet-day__head">
                <label className="sheet-day__check">
                  <input
                    type="checkbox"
                    checked={isDone}
                    onChange={() => toggleDay(day.day)}
                    aria-label={`Mark day ${day.day} as complete`}
                  />
                </label>
                <div>
                  <h2 className="sheet-day__title">
                    Day {day.day}: {day.title}
                  </h2>
                  <p className="sheet-day__goal">{day.goal}</p>
                </div>
              </div>

              {day.topicSlugs.length > 0 ? (
                <div className="sheet-day__group">
                  <h3 className="sheet-day__label">Topics</h3>
                  <ul className="sheet-day__links">
                    {day.topicSlugs.map((topicSlug) => {
                      const found = findTopicBySlug(topicSlug);
                      return (
                        <li key={topicSlug}>
                          {found ? (
                            <Link to={`/${found.category}/${found.topic.slug}`}>
                              {found.topic.title}
                            </Link>
                          ) : (
                            topicSlug
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}

              {day.problemIds.length > 0 ? (
                <div className="sheet-day__group">
                  <h3 className="sheet-day__label">Problems</h3>
                  <ul className="sheet-day__links">
                    {day.problemIds.map((id) => {
                      const problem = getProblem(id);
                      if (!problem) return <li key={id}>{id}</li>;
                      return (
                        <li key={id}>
                          <Link to={`/problems/${problem.slug}`}>{problem.title}</Link>{' '}
                          <a
                            href={problem.leetcodeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="sheet-day__leet"
                          >
                            ↗
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
    </PageShell>
  );
}

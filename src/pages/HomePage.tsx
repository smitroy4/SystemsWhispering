import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageShell } from '../components/layout/index.ts';
import { Card } from '../components/ui/index.ts';
import { getAllTopics } from '../utils/content.ts';
import { problems } from '../content/problems/index.ts';
import { sheets } from '../content/sheets/index.ts';
import { usePageMeta } from '../utils/pageMeta.ts';
import './HomePage.css';

interface ResumeState {
  sheetSlug: string;
  sheetTitle: string;
  nextDay: number;
  totalDays: number;
  solvedCount: number;
}

function readResumeState(): ResumeState | null {
  try {
    let best: { slug: string; title: string; done: number; total: number } | null = null;
    for (const sheet of sheets) {
      const raw = window.localStorage.getItem(`s4j-sheet-progress-${sheet.slug}`);
      if (!raw) continue;
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) continue;
      const done = parsed.filter((d): d is number => typeof d === 'number').length;
      if (done === 0) continue;
      if (!best || done / sheet.days.length > best.done / best.total) {
        best = { slug: sheet.slug, title: sheet.title, done, total: sheet.days.length };
      }
    }
    const solvedRaw = window.localStorage.getItem('s4j-dsa-solved-problems');
    const solvedParsed: unknown = solvedRaw ? JSON.parse(solvedRaw) : [];
    const solvedCount = Array.isArray(solvedParsed) ? solvedParsed.length : 0;
    if (!best) {
      return solvedCount > 0
        ? { sheetSlug: '', sheetTitle: '', nextDay: 0, totalDays: 0, solvedCount }
        : null;
    }
    const sheet = sheets.find((s) => s.slug === best.slug);
    const completedDays = new Set<number>(
      JSON.parse(window.localStorage.getItem(`s4j-sheet-progress-${best.slug}`) ?? '[]') as number[],
    );
    const nextDay = sheet?.days.map((d) => d.day).find((d) => !completedDays.has(d)) ?? 1;
    return {
      sheetSlug: best.slug,
      sheetTitle: best.title,
      nextDay,
      totalDays: best.total,
      solvedCount,
    };
  } catch {
    return null;
  }
}

const SECTIONS = [
  {
    to: '/data-structures',
    title: 'Data Structures',
    blurb: 'Arrays to advanced graphs, with memory-level Java intuition.',
    count: (n: number) => `${n} topics`,
  },
  {
    to: '/algorithms',
    title: 'Algorithms',
    blurb: 'Searching, sorting, and problem-solving patterns in plain Java.',
    count: (n: number) => `${n} topics`,
  },
  {
    to: '/concepts',
    title: 'Concepts',
    blurb: 'Complexity, recursion, Java memory, and collections know-how.',
    count: (n: number) => `${n} topics`,
  },
  {
    to: '/problems',
    title: 'Problems',
    blurb: 'Curated LeetCode practice with filters and progress tracking.',
    count: (n: number) => `${n} problems`,
  },
] as const;

export default function HomePage() {
  usePageMeta(
    'Learn Data Structures & Algorithms in Java',
    'Systems Whispering — learn the craft, whisper to systems: data structures and algorithms from scratch, arrays to advanced graphs, with Java code and animated visualizations.',
  );

  const [resume] = useState<ResumeState | null>(readResumeState);
  const counts = {
    'data-structures': getAllTopics('data-structures').length,
    algorithms: getAllTopics('algorithms').length,
    concepts: getAllTopics('concepts').length,
    problems: problems.length,
  };
  const path = getAllTopics('data-structures');

  return (
    <PageShell
      title="Systems Whispering"
      description="Learn the craft. Whisper to systems. Data structures and algorithms from scratch — arrays to advanced graphs — with Java code and animated visualizations."
    >
      <section className="hero" aria-label="Introduction">
        <h2 className="hero__title">From arrays to advanced graphs, one visualization at a time.</h2>
        <p className="hero__text">
          Every topic pairs plain-English explanation with compilable Java and a
          step-by-step animation you can play, pause, and scrub.
        </p>
        <div className="hero__actions">
          <Link className="hero__cta" to="/data-structures/array">
            Start with Arrays
          </Link>
          <Link className="hero__secondary" to="/sheets">
            Pick a study sheet
          </Link>
        </div>
      </section>

      {resume ? (
        <Card title="Continue where you left off">
          {resume.sheetSlug ? (
            <p>
              <Link to={`/sheets/${resume.sheetSlug}`}>
                {resume.sheetTitle} — day {resume.nextDay} of {resume.totalDays}
              </Link>
            </p>
          ) : null}
          {resume.solvedCount > 0 ? (
            <p>
              <Link to="/problems">{resume.solvedCount} problems solved — keep going</Link>
            </p>
          ) : null}
        </Card>
      ) : null}

      <h2 className="home-section-title">Browse sections</h2>
      <div className="home-cards">
        {SECTIONS.map((section) => (
          <Card key={section.to} title={section.title}>
            <p>{section.blurb}</p>
            <p>
              <Link to={section.to}>
                {section.to === '/problems'
                  ? section.count(counts.problems)
                  : section.count(
                      counts[
                        section.to.slice(1) as 'data-structures' | 'algorithms' | 'concepts'
                      ],
                    )}{' '}
                →
              </Link>
            </p>
          </Card>
        ))}
      </div>

      <h2 className="home-section-title">Learning path</h2>
      <ol className="learning-path" aria-label="Suggested learning order">
        {path.map((topic) => (
          <li key={topic.slug} className="learning-path__step">
            <Link to={`/data-structures/${topic.slug}`}>{topic.title}</Link>
          </li>
        ))}
      </ol>

      <h2 className="home-section-title">Study sheets</h2>
      <div className="home-cards">
        {sheets.map((sheet) => (
          <Card key={sheet.slug} title={sheet.title}>
            <p>{sheet.description}</p>
            <p>
              <Link to={`/sheets/${sheet.slug}`}>{sheet.days.length} days →</Link>
            </p>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}

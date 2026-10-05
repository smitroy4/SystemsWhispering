import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageShell } from '../components/layout/index.ts';
import { Card } from '../components/ui/index.ts';
import { getAllTopics } from '../utils/content.ts';
import { problems } from '../content/problems/index.ts';
import { lldModules } from '../content/lld/index.ts';
import { usePageMeta } from '../utils/pageMeta.ts';
import './HomePage.css';

interface ResumeState {
  solvedCount: number;
}

function readResumeState(): ResumeState | null {
  try {
    const solvedRaw = window.localStorage.getItem('s4j-dsa-solved-problems');
    const solvedParsed: unknown = solvedRaw ? JSON.parse(solvedRaw) : [];
    const ids = Array.isArray(solvedParsed)
      ? solvedParsed.filter((id): id is string => typeof id === 'string')
      : Object.keys(solvedParsed as Record<string, unknown>).filter(
          (id) => (solvedParsed as Record<string, unknown>)[id] === true,
        );
    const solvedCount = ids.length;
    return solvedCount > 0 ? { solvedCount } : null;
  } catch {
    return null;
  }
}

const SECTIONS = [
  {
    to: '/data-structures',
    title: 'Data Structures',
    blurb: 'Linear, non-linear, Java collections, and concurrent structures — with memory-level intuition.',
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
    blurb: 'Complexity, recursion, Java memory, bit tricks, and collections know-how.',
    count: (n: number) => `${n} topics`,
  },
  {
    to: '/problems',
    title: 'Problems',
    blurb: 'Curated LeetCode practice with filters and progress tracking.',
    count: (n: number) => `${n} problems`,
  },
  {
    to: '/lld',
    title: 'Low-Level Design',
    blurb: 'Object-oriented design, SOLID, and patterns in Java — growing module by module.',
    count: (n: number) => `${n} ${n === 1 ? 'module' : 'modules'}`,
  },
] as const;

export default function HomePage() {
  usePageMeta(
    'Java Data Structures & Algorithms, Collections, Concurrency and Low-Level Design',
    'Systems Whispering — learn Java DSA visually: 60+ animated topics, compilable Java code, curated LeetCode practice with progress tracking, guided study sheets, and low-level design.',
  );

  const [resume] = useState<ResumeState | null>(readResumeState);
  const counts: Record<string, number> = {
    'data-structures': getAllTopics('data-structures').length,
    algorithms: getAllTopics('algorithms').length,
    concepts: getAllTopics('concepts').length,
    problems: problems.length,
    lld: lldModules.length,
  };
  const path = getAllTopics('data-structures');

  return (
    <PageShell
      title="Systems Whispering"
      description="Learn the craft. Whisper to systems. Java data structures, algorithms, and collections — then low-level design — taught visually with animations and code you can compile."
    >
      <section className="hero" aria-label="Introduction">
        <h2 className="hero__title">From arrays to system design, one visualization at a time.</h2>
        <p className="hero__text">
          Every topic pairs plain-English explanation with compilable Java and a
          step-by-step animation you can play, pause, and scrub — then locks it
          in with curated practice and guided study sheets.
        </p>
        <div className="hero__actions">
          <Link className="hero__cta" to="/sheets">
            Start with a Sheet
          </Link>
        </div>
      </section>

      {resume ? (
        <Card title="Continue where you left off">
          <p>
            <Link to="/problems">{resume.solvedCount} problems solved — keep going</Link>
          </p>
        </Card>
      ) : null}

      <h2 className="home-section-title">Browse sections</h2>
      <div className="home-cards">
        {SECTIONS.map((section) => (
          <Card key={section.to} title={section.title}>
            <p>{section.blurb}</p>
            <p>
              <Link to={section.to}>
                {section.count(counts[section.to.slice(1)] ?? 0)} →
              </Link>
              {section.to === '/problems' ? (
                <span>
                  {' '}
                  · <Link to="/sheets">Study sheets</Link>
                </span>
              ) : null}
            </p>
          </Card>
        ))}
      </div>

      <h2 className="home-section-title">How it works</h2>
      <div className="home-cards">
        <Card title="Learn the intuition">
          <p>Plain-English explanations with memory-level detail — when to use each structure, and when to avoid it.</p>
        </Card>
        <Card title="Watch it move">
          <p>Step-by-step SVG animations with play, pause, and speed controls. Every operation, frame by frame.</p>
        </Card>
        <Card title="Practice deliberately">
          <p>Curated LeetCode problems per topic, five guided study sheets, and progress that saves in your browser.</p>
        </Card>
      </div>

      <h2 className="home-section-title">Learning path</h2>
      <ol className="learning-path" aria-label="Suggested learning order">
        {path.map((topic) => (
          <li key={topic.slug} className="learning-path__step">
            <Link to={`/data-structures/${topic.slug}`}>{topic.title}</Link>
          </li>
        ))}
      </ol>
    </PageShell>
  );
}

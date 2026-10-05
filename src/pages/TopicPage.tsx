import { Link, useParams } from 'react-router-dom';
import { Suspense } from 'react';
import { usePageMeta } from '../utils/pageMeta.ts';
import { PageShell } from '../components/layout/index.ts';
import {
  Badge,
  CodeBlock,
  ComplexityTable,
  Tabs,
} from '../components/ui/index.ts';
import { getViz } from '../components/viz/index.ts';
import type {
  ProblemDifficulty,
  Topic,
  TopicCategory,
  TopicLevel,
} from '../types/content.ts';
import { getAllTopics, getProblem, getTopic } from '../utils/content.ts';
import { renderMarkdownLite } from '../utils/markdownLite.tsx';
import TopicSidebar from './TopicSidebar.tsx';
import './TopicPage.css';

interface TopicPageProps {
  category: TopicCategory;
}

const ALL_CATEGORIES: TopicCategory[] = ['data-structures', 'algorithms', 'concepts'];

const LEVEL_LABELS: Record<TopicLevel, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  expert: 'Expert',
};

function levelTone(level: TopicLevel): 'success' | 'warning' | 'danger' | 'info' {
  if (level === 'beginner') return 'success';
  if (level === 'intermediate') return 'warning';
  if (level === 'advanced') return 'danger';
  return 'info';
}

function difficultyTone(difficulty: ProblemDifficulty): 'success' | 'warning' | 'danger' {
  if (difficulty === 'Easy') return 'success';
  if (difficulty === 'Medium') return 'warning';
  return 'danger';
}

/** Find a topic by slug across every category (for prerequisite links). */
function findTopic(slug: string): { category: TopicCategory; topic: Topic } | undefined {
  for (const category of ALL_CATEGORIES) {
    const topic = getTopic(category, slug);
    if (topic) return { category, topic };
  }
  return undefined;
}

/**
 * Generic topic template used by Data Structures, Algorithms and Concepts.
 * Order: header → Intro → Visualization → Java code → Complexity →
 * Common mistakes → Practice problems → Prev/Next.
 */
export default function TopicPage({ category }: TopicPageProps) {
  const { slug } = useParams<{ slug: string }>();
  const topic = slug ? getTopic(category, slug) : undefined;

  usePageMeta(
    topic ? topic.title : 'Topic not found',
    topic?.summary ?? 'This topic does not exist yet.',
  );

  if (!topic) {
    return (
      <PageShell title="Topic not found" description="This topic does not exist yet.">
        <div className="placeholder">
          <h1>Unknown topic{slug ? `: ${slug}` : ''}</h1>
          <p>
            <Link to={`/${category}`}>Back to the index</Link>.
          </p>
        </div>
      </PageShell>
    );
  }

  const topics = getAllTopics(category);
  const position = topics.findIndex((t) => t.slug === topic.slug);
  const prev = position > 0 ? topics[position - 1] : undefined;
  const next = position >= 0 && position < topics.length - 1 ? topics[position + 1] : undefined;

  const Viz = topic.vizId ? getViz(topic.vizId) : undefined;
  const problems = topic.problemIds
    .map((id) => getProblem(id))
    .filter((p) => p !== undefined);

  return (
    <PageShell
      title={topic.title}
      description={topic.summary}
      sidebar={<TopicSidebar category={category} activeSlug={topic.slug} />}
    >
      <div className="topic-meta">
        <Badge tone={levelTone(topic.level)}>{LEVEL_LABELS[topic.level]}</Badge>
        {topic.prerequisites.length > 0 ? (
          <p className="topic-meta__prereqs">
            Prerequisites:{' '}
            {topic.prerequisites.map((prereq, i) => {
              const found = findTopic(prereq);
              return (
                <span key={prereq}>
                  {i > 0 ? ', ' : ''}
                  {found ? (
                    <Link to={`/${found.category}/${found.topic.slug}`}>
                      {found.topic.title}
                    </Link>
                  ) : (
                    prereq
                  )}
                </span>
              );
            })}
          </p>
        ) : null}
      </div>

      {topic.choiceBox ? (
        <div className="topic-choicebox" aria-label="When to choose this">
          <div className="topic-choicebox__col topic-choicebox__col--choose">
            <h2 className="topic-choicebox__title">Choose this when</h2>
            <ul>
              {topic.choiceBox.choose.map((item, i) => (
                <li key={i}>{renderMarkdownLite(item)}</li>
              ))}
            </ul>
          </div>
          <div className="topic-choicebox__col topic-choicebox__col--avoid">
            <h2 className="topic-choicebox__title">Avoid when</h2>
            <ul>
              {topic.choiceBox.avoid.map((item, i) => (
                <li key={i}>{renderMarkdownLite(item)}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      <section className="topic-section" aria-label="Introduction">
        {topic.sections.map((section, i) => (
          <div key={i}>
            <h2 className="topic-section__title">{section.heading}</h2>
            <div className="topic-section__body">{renderMarkdownLite(section.body)}</div>
          </div>
        ))}
      </section>

      <section className="topic-section" aria-label="Visualization">
        <h2 className="topic-section__title">Visualization</h2>
        {Viz ? (
          <Suspense fallback={<p aria-live="polite">Loading visualization…</p>}>
            <Viz />
          </Suspense>
        ) : (
          <div className="topic-viz-soon">
            <p>Visualization coming soon — the step engine is ready, the scene is not.</p>
          </div>
        )}
      </section>

      <section className="topic-section" aria-label="Java code">
        <h2 className="topic-section__title">Java code</h2>
        {topic.javaCode.length > 1 ? (
          <Tabs
            tabs={topic.javaCode.map((snippet, i) => ({
              id: `snippet-${i}`,
              label: snippet.title,
              content: (
                <CodeBlock
                  title={snippet.title}
                  description={snippet.description}
                  code={snippet.code}
                />
              ),
            }))}
          />
        ) : (
          topic.javaCode.map((snippet, i) => (
            <CodeBlock
              key={i}
              title={snippet.title}
              description={snippet.description}
              code={snippet.code}
            />
          ))
        )}
      </section>

      <section className="topic-section" aria-label="Complexity">
        <h2 className="topic-section__title">Complexity</h2>
        <ComplexityTable rows={topic.complexity} caption={`${topic.title} costs`} />
      </section>

      <section className="topic-section" aria-label="Common mistakes">
        <h2 className="topic-section__title">Common mistakes</h2>
        <ul className="topic-mistakes">
          {topic.mistakes.map((mistake, i) => (
            <li key={i}>{mistake}</li>
          ))}
        </ul>
      </section>

      <section className="topic-section" aria-label="Practice problems">
        <h2 className="topic-section__title">Practice problems</h2>
        {topic.practiceNote ? (
          <p className="topic-practice-note">{topic.practiceNote}</p>
        ) : null}
        {problems.length > 0 ? (
          <ul className="topic-problems">
            {problems.map((problem) => (
              <li key={problem.id} className="topic-problems__card">
                <a
                  href={problem.leetcodeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="topic-problems__link"
                >
                  {problem.title}
                </a>
                <div className="topic-problems__tags">
                  <Badge tone={difficultyTone(problem.difficulty)}>
                    {problem.difficulty}
                  </Badge>
                  {problem.patterns.map((pattern) => (
                    <span key={pattern} className="topic-problems__tag">
                      {pattern}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="topic-problems__empty">
            Practice problems link here once the problem bank covers this topic.
          </p>
        )}
      </section>

      <nav className="topic-pager" aria-label="Previous and next topics">
        {prev ? (
          <Link to={`/${category}/${prev.slug}`} className="topic-pager__link">
            <span className="topic-pager__dir">← Previous</span>
            <span className="topic-pager__title">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to={`/${category}/${next.slug}`}
            className="topic-pager__link topic-pager__link--next"
          >
            <span className="topic-pager__dir">Next →</span>
            <span className="topic-pager__title">{next.title}</span>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </PageShell>
  );
}

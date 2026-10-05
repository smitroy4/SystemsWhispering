import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageShell } from '../components/layout/index.ts';
import { Badge, CodeBlock, Tabs } from '../components/ui/index.ts';
import { getLldModule, getLldTopic } from '../content/lld/index.ts';
import { lldModules } from '../content/lld/index.ts';
import type { QuizItem } from '../types/lld.ts';
import { getLldDiagram } from '../components/viz/lld/lldGallery.ts';
import { renderMarkdownLite } from '../utils/markdownLite.tsx';
import { usePageMeta } from '../utils/pageMeta.ts';
import LldSidebar from '../components/layout/LldSidebar.tsx';
import './LldPages.css';

function QuizBlock({ quiz }: { quiz: QuizItem[] }) {
  const [picked, setPicked] = useState<Record<number, number | null>>({});
  return (
    <div className="lld-quiz" aria-label="Self check">
      {quiz.map((item, qi) => {
        const answer = picked[qi] ?? null;
        const done = answer !== null;
        return (
          <div key={qi} className="lld-quiz__item">
            <p className="lld-quiz__question">
              Q{qi + 1}. {item.question}
            </p>
            <div className="lld-quiz__options" role="group" aria-label={`Question ${qi + 1}`}>
              {item.options.map((option, oi) => {
                const isAnswer = oi === item.answerIndex;
                const isPicked = answer === oi;
                const cls = [
                  'lld-quiz__option',
                  done && isAnswer ? 'lld-quiz__option--correct' : '',
                  done && isPicked && !isAnswer ? 'lld-quiz__option--wrong' : '',
                ]
                  .join(' ')
                  .trim();
                return (
                  <button
                    key={oi}
                    type="button"
                    className={cls}
                    disabled={done}
                    onClick={() => setPicked((p) => ({ ...p, [qi]: oi }))}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            {done ? <p className="lld-quiz__why">{item.explanation}</p> : null}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Full LLD topic template: header → subtopics → illustrations →
 * Java code → takeaways → interview tips → pitfalls → quiz → prev/next.
 */
export default function LldTopicPage() {
  const { module: moduleSlug, topic: topicSlug } = useParams<{ module: string; topic: string }>();
  const module = moduleSlug ? getLldModule(moduleSlug) : undefined;
  const topic = moduleSlug && topicSlug ? getLldTopic(moduleSlug, topicSlug) : undefined;

  usePageMeta(
    topic ? topic.title : 'Topic not found',
    topic?.summary ?? 'This LLD topic does not exist yet.',
  );

  if (!module || !topic) {
    return (
      <PageShell title="Topic not found" description="This LLD topic does not exist yet.">
        <div className="placeholder">
          <h1>Unknown topic{topicSlug ? `: ${topicSlug}` : ''}</h1>
          <p>
            <Link to="/lld">Back to Low-Level Design</Link>.
          </p>
        </div>
      </PageShell>
    );
  }

  const position = module.topics.findIndex((t) => t.slug === topic.slug);
  const moduleIndex = lldModules.findIndex((m) => m.slug === module.slug);
  const firstOfModule = module.topics[0];
  const prevModule = moduleIndex > 0 ? lldModules[moduleIndex - 1] : undefined;
  const nextModule =
    moduleIndex >= 0 && moduleIndex < lldModules.length - 1 ? lldModules[moduleIndex + 1] : undefined;

  interface PagerTarget {
    moduleSlug: string;
    slug: string;
    title: string;
  }
  const prev: PagerTarget | undefined =
    position > 0
      ? {
          moduleSlug: module.slug,
          slug: module.topics[position - 1].slug,
          title: module.topics[position - 1].title,
        }
      : prevModule && prevModule.topics.length > 0
        ? {
            moduleSlug: prevModule.slug,
            slug: prevModule.topics[prevModule.topics.length - 1].slug,
            title: prevModule.topics[prevModule.topics.length - 1].title,
          }
        : undefined;
  const next: PagerTarget | undefined =
    position >= 0 && position < module.topics.length - 1
      ? {
          moduleSlug: module.slug,
          slug: module.topics[position + 1].slug,
          title: module.topics[position + 1].title,
        }
      : nextModule && nextModule.topics.length > 0
        ? {
            moduleSlug: nextModule.slug,
            slug: nextModule.topics[0].slug,
            title: nextModule.topics[0].title,
          }
        : undefined;

  return (
    <PageShell
      title={topic.title}
      description={topic.summary}
      sidebar={<LldSidebar />}
    >
      <p className="lld-crumb">
        <Link to="/lld">LLD</Link> /{' '}
        {firstOfModule ? (
          <Link to={`/lld/${module.slug}/${firstOfModule.slug}`}>{module.title}</Link>
        ) : (
          module.title
        )}
      </p>

      <section className="topic-section" aria-label="Concepts">
        {topic.subtopics.map((sub) => (
          <div key={sub.id}>
            <h2 className="topic-section__title">{sub.title}</h2>
            <div className="topic-section__body">{renderMarkdownLite(sub.body)}</div>
          </div>
        ))}
      </section>

      {topic.diagrams.length > 0 ? (
        <section className="topic-section" aria-label="Illustrations">
          <h2 className="topic-section__title">Illustrations</h2>
          {topic.diagrams.map((id) => {
            const entry = getLldDiagram(id);
            if (!entry) return null;
            const { Component } = entry;
            return (
              <figure key={id} className="lld-figure">
                <Component />
                <figcaption>{entry.title}</figcaption>
              </figure>
            );
          })}
        </section>
      ) : null}

      {topic.javaCode.length > 0 ? (
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
      ) : null}

      <section className="topic-section" aria-label="Key takeaways">
        <h2 className="topic-section__title">Key takeaways</h2>
        <ul className="topic-mistakes">
          {topic.keyTakeaways.map((takeaway, i) => (
            <li key={i}>{takeaway}</li>
          ))}
        </ul>
      </section>

      {topic.interviewTips.length > 0 ? (
        <section className="topic-section" aria-label="Interview tips">
          <h2 className="topic-section__title">Interview tips</h2>
          <ul className="topic-mistakes">
            {topic.interviewTips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {topic.pitfalls.length > 0 ? (
        <section className="topic-section" aria-label="Common pitfalls">
          <h2 className="topic-section__title">Common pitfalls</h2>
          <ul className="topic-mistakes">
            {topic.pitfalls.map((pitfall, i) => (
              <li key={i}>{pitfall}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {topic.quiz && topic.quiz.length > 0 ? (
        <section className="topic-section" aria-label="Self check">
          <h2 className="topic-section__title">Self check</h2>
          <QuizBlock quiz={topic.quiz} />
        </section>
      ) : null}

      <div className="topic-meta">
        <Badge tone="info">
          Module {module.order} · Topic {topic.order}
        </Badge>
      </div>

      <nav className="topic-pager" aria-label="Previous and next topics">
        {prev ? (
          <Link to={`/lld/${prev.moduleSlug}/${prev.slug}`} className="topic-pager__link">
            <span className="topic-pager__dir">← Previous</span>
            <span className="topic-pager__title">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to={`/lld/${next.moduleSlug}/${next.slug}`}
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

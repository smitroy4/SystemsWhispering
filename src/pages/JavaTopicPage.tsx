import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageShell } from '../components/layout/index.ts';
import { Badge, CodeBlock, Tabs } from '../components/ui/index.ts';
import { getJavaModule, getJavaTopic } from '../content/java/index.ts';
import { javaModules } from '../content/java/index.ts';
import VisualBlock from '../components/viz/java/VisualBlock.tsx';
import { getTopicVisuals } from '../components/viz/java/javaVisuals.tsx';
import { renderMarkdownLite } from '../utils/markdownLite.tsx';
import { usePageMeta } from '../utils/pageMeta.ts';
import JavaSidebar from '../components/layout/JavaSidebar.tsx';
import './JavaPages.css';

function QuizBlock({ quiz }: { quiz: JavaQuizItem[] }) {
  const [picked, setPicked] = useState<Record<number, number | null>>({});
  return (
    <div className="java-quiz" aria-label="Self check">
      {quiz.map((item, qi) => {
        const answer = picked[qi] ?? null;
        const done = answer !== null;
        return (
          <div key={qi} className="java-quiz__item">
            <p className="java-quiz__question">Q{qi + 1}. {item.question}</p>
            <div className="java-quiz__options" role="group" aria-label={`Question ${qi + 1}`}>
              {item.options.map((option, oi) => {
                const isAnswer = oi === item.answerIndex;
                const isPicked = answer === oi;
                const cls = [
                  'java-quiz__option',
                  done && isAnswer ? 'java-quiz__option--correct' : '',
                  done && isPicked && !isAnswer ? 'java-quiz__option--wrong' : '',
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
            {done ? <p className="java-quiz__why">{item.explanation}</p> : null}
          </div>
        );
      })}
    </div>
  );
}

interface JavaQuizItem {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

/** Find a Java topic by slug across all modules (for prerequisite links). */
function findJavaTopic(slug: string): { moduleSlug: string; topic: JavaTopic } | undefined {
  for (const module of javaModules) {
    const topic = module.topics.find((t) => t.slug === slug);
    if (topic) return { moduleSlug: module.slug, topic };
  }
  return undefined;
}

interface JavaTopic {
  slug: string;
  title: string;
  order: number;
  summary: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  prerequisites?: string[];
  sections: { heading: string; body: string }[];
  vizId?: string;
  javaBuiltIn?: string[];
  related?: string[];
  javaCode: { title: string; description: string; code: string }[];
  complexity?: { operation: string; best: string; average: string; worst: string; space?: string }[];
  mistakes?: string[];
  choiceBox?: { choose: string[]; avoid: string[] };
  quiz?: JavaQuizItem[];
  jdkClasses?: string[];
}

/** A Java topic page: header → choice box → sections → visualization → Java code → complexity → mistakes → quiz → prev/next. */
export default function JavaTopicPage() {
  const { module: moduleSlug, topic: topicSlug } = useParams<{ module: string; topic: string }>();
  const module = moduleSlug ? getJavaModule(moduleSlug) : undefined;
  const topic = moduleSlug && topicSlug ? getJavaTopic(moduleSlug, topicSlug) : undefined;

  usePageMeta(
    topic ? topic.title : 'Topic not found',
    topic?.summary ?? 'This Java topic does not exist yet.',
  );

  if (!module || !topic) {
    return (
      <PageShell title="Topic not found" description="This Java topic does not exist yet.">
        <div className="placeholder">
          <h1>Unknown topic{topicSlug ? `: ${topicSlug}` : ''}</h1>
          <p>
            <Link to="/java">Back to Java: The Backbone</Link>.
          </p>
        </div>
      </PageShell>
    );
  }

  const position = module.topics.findIndex((t) => t.slug === topic.slug);
  const moduleIndex = javaModules.findIndex((m) => m.slug === module.slug);
  const prevModule = moduleIndex > 0 ? javaModules[moduleIndex - 1] : undefined;
  const nextModule =
    moduleIndex >= 0 && moduleIndex < javaModules.length - 1 ? javaModules[moduleIndex + 1] : undefined;

  const prev: { moduleSlug: string; slug: string; title: string } | undefined =
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
  const next: { moduleSlug: string; slug: string; title: string } | undefined =
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

  const topicVisuals = getTopicVisuals(topic.slug);

  return (
    <PageShell
      title={topic.title}
      description={topic.summary}
      sidebar={<JavaSidebar />}
    >
      <div className="topic-meta">
        <Badge tone={topic.level === 'beginner' ? 'success' : topic.level === 'intermediate' ? 'warning' : topic.level === 'advanced' ? 'danger' : 'info'}>
          {topic.level.charAt(0).toUpperCase() + topic.level.slice(1)}
        </Badge>
        {(topic.prerequisites ?? []).length > 0 ? (
          <p className="topic-meta__prereqs">
            Prerequisites:{' '}
            {(topic.prerequisites ?? []).map((prereq, i) => {
              const found = findJavaTopic(prereq);
              return (
                <span key={prereq}>
                  {i > 0 ? ', ' : ''}
                  {found ? (
                    <Link to={`/java/${found.moduleSlug}/${found.topic.slug}`}>
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

      <p className="java-crumb">
        <Link to="/java">Java</Link> /{' '}
        <Link to={`/java/${module.slug}/${module.topics[0].slug}`}>
          {module.topics[0].title}
        </Link>
      </p>

      {topic.youtubeUrls && topic.youtubeUrls.length > 0 ? (
        <section className="topic-section" aria-label="Video explainer">
          <h2 className="topic-section__title">Video explainer</h2>
          {topic.youtubeUrls.map((url, i) => {
            let videoId = '';
            try {
              videoId = new URL(url).searchParams.get('v') ?? '';
            } catch {
              videoId = '';
            }
            return (
              <div key={i} className="topic-video">
                {videoId ? (
                  <iframe
                    title={`Video explainer ${i + 1}`}
                    src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                    width="560"
                    height="315"
                    frameBorder="0"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                ) : (
                  <p className="topic-video-soon">
                    Video explainer not yet published for this topic.
                  </p>
                )}
              </div>
            );
          })}
        </section>
      ) : (
        <section className="topic-section" aria-label="Video explainer">
          <h2 className="topic-section__title">Video explainer</h2>
          <p className="topic-video-soon">Video explainer not yet published for this topic.</p>
        </section>
      )}

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

      <section className="topic-section" aria-label="Concepts">
        {topic.sections.map((section, i) => {
          const sectionVisuals = topicVisuals.slice(i * 2, (i + 1) * 2);
          return (
            <div key={i} className="topic-section__group">
              <h2 className="topic-section__title">{section.heading}</h2>
              <div className="topic-section__body">{renderMarkdownLite(section.body)}</div>
              {sectionVisuals.map((spec, vi) => (
                <VisualBlock key={vi} spec={spec} />
              ))}
            </div>
          );
        })}
      </section>

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
          <Link to={`/java/${prev.moduleSlug}/${prev.slug}`} className="topic-pager__link">
            <span className="topic-pager__dir">← Previous</span>
            <span className="topic-pager__title">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to={`/java/${next.moduleSlug}/${next.slug}`}
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

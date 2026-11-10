import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { usePageMeta } from '../utils/pageMeta.ts';
import { PageShell } from '../components/layout/index.ts';
import { Badge, CodeBlock, ComplexityTable, Tabs } from '../components/ui/index.ts';
import { renderMarkdownLite } from '../utils/markdownLite.tsx';
import { getProblem } from '../utils/content.ts';
import { problemContents } from '../content/problems/problemContents.ts';
import type { ProblemDifficulty } from '../types/content.ts';
import './ProblemDetailPage.css';

const LEETCODE_LOGO_URL =
  'https://img.icons8.com/external-tal-revivo-color-tal-revivo/48/external-level-up-your-coding-skills-and-quickly-land-a-job-logo-color-tal-revivo.png';

function difficultyTone(difficulty: ProblemDifficulty): 'success' | 'warning' | 'danger' {
  if (difficulty === 'Easy') return 'success';
  if (difficulty === 'Medium') return 'warning';
  return 'danger';
}

function solutionTabs(solutions: {
  label: string;
  intuition?: string;
  algorithm?: string[];
  detailedWalkthrough?: string[];
  correctnessCheck?: string;
  code: string;
  complexity: { time: string; space: string };
}[]) {
  return solutions.map((sol, i) => ({
    id: `solution-${i}`,
    label: sol.label,
    content: (
      <>
        {sol.intuition && (
          <>
            <h4 className="pd-solution__label">Intuition</h4>
            <p className="pd-solution__desc">{sol.intuition}</p>
          </>
        )}
        {sol.algorithm && sol.algorithm.length > 0 && (
          <>
            <h4 className="pd-solution__label">Algorithm</h4>
            <ol className="pd-algorithm">
              {sol.algorithm.map((step, si) => (
                <li key={si}>{step.replace(/^\d+\.\s*/, '')}</li>
              ))}
            </ol>
          </>
        )}
        {sol.detailedWalkthrough && sol.detailedWalkthrough.length > 0 && (
          <>
            <h4 className="pd-solution__label">Detailed Walkthrough</h4>
            <ol className="pd-algorithm">
              {sol.detailedWalkthrough.map((step, si) => (
                <li key={si}>{step.replace(/^\d+\.\s*\*\*[^*]+\*\*\s*/, '').replace(/^\d+\.\s*/, '')}</li>
              ))}
            </ol>
          </>
        )}
        {sol.correctnessCheck && (
          <>
            <h4 className="pd-solution__label">Correctness Check</h4>
            <p className="pd-solution__desc">{sol.correctnessCheck}</p>
          </>
        )}
        {!sol.intuition && !sol.algorithm && !sol.detailedWalkthrough && !sol.correctnessCheck && (
          <p className="pd-solution__desc">{sol.label} approach.</p>
        )}
        <CodeBlock title={`Java — ${sol.label}`} description={sol.label} code={sol.code} />
        <ComplexityTable
          rows={[
            { operation: 'Time', best: sol.complexity.time, average: sol.complexity.time, worst: sol.complexity.time },
            { operation: 'Space', best: sol.complexity.space, average: sol.complexity.space, worst: sol.complexity.space },
          ]}
          caption={`${sol.label} complexity`}
        />
      </>
    ),
  }));
}

export default function ProblemDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const problem = slug ? getProblem(slug) : undefined;
  const content = problem ? problemContents.find((c) => c.slug === problem!.slug) : undefined;
  const [language, setLanguage] = useState<'java' | 'python'>('java');

  usePageMeta(
    content ? content.title : 'Problem not found',
    content ? `${content.title} — solutions walkthrough` : 'This problem does not exist yet.',
  );

  if (!problem || !content) {
    return (
      <PageShell title="Problem not found" description="This problem does not exist yet.">
        <div className="placeholder">
          <h1>Unknown problem{slug ? `: ${slug}` : ''}</h1>
          <p><Link to="/problems">Back to problems index</Link>.</p>
        </div>
      </PageShell>
    );
  }

  const lastSolution = content.solutions[content.solutions.length - 1];

  return (
    <PageShell title={content.title} description={`LeetCode #${problem.id} — ${content.difficulty}`}>
      {/* Top info bar (replaces the side sidebar) */}
      <div className="pd-topbar">
        <div className="pd-topbar__meta">
          <Badge tone={difficultyTone(content.difficulty)}>{content.difficulty}</Badge>
          <span className="pd-topbar__number">#{problem.id}</span>
        </div>
        <a href={problem.leetcodeUrl} target="_blank" rel="noreferrer" className="pd-topbar__leet">
          Solve on LeetCode ↗
        </a>
        <nav className="pd-topbar__nav">
          <ul>
            <li><a href="#description">Description</a></li>
            <li><a href="#examples">Examples</a></li>
            {content.constraints && <li><a href="#constraints">Constraints</a></li>}
            <li><a href="#solutions">Solutions</a></li>
          </ul>
        </nav>
      </div>

      <section id="description" className="pd-section" aria-label="Description">
        <h2 className="pd-section__title">Description</h2>
        <div className="pd-section__body">{renderMarkdownLite(content.description)}</div>
      </section>

      {content.problemIntuition && (
        <section id="problem-intuition" className="pd-section" aria-label="Problem Intuition">
          <h2 className="pd-section__title">Problem Intuition</h2>
          <div className="pd-section__body">{renderMarkdownLite(content.problemIntuition)}</div>
        </section>
      )}

      <section id="examples" className="pd-section" aria-label="Examples">
        <h2 className="pd-section__title">Examples</h2>
        <div className="pd-examples">
          {content.examples.map((ex, i) => (
            <div key={i} className="pd-example">
              <h3 className="pd-example__title">Example {i + 1}</h3>
              <dl className="pd-example__list">
                <dt>Input</dt>
                <dd><code>{ex.input}</code></dd>
                <dt>Output</dt>
                <dd><code>{ex.output}</code></dd>
                {ex.explanation && (
                  <>
                    <dt>Explanation</dt>
                    <dd>{ex.explanation}</dd>
                  </>
                )}
              </dl>
            </div>
          ))}
        </div>
      </section>

      {content.constraints && (
        <section id="constraints" className="pd-section" aria-label="Constraints">
          <h2 className="pd-section__title">Constraints</h2>
          <div className="pd-section__body">{renderMarkdownLite(content.constraints)}</div>
        </section>
      )}

      <section id="solutions" className="pd-section" aria-label="Solutions">
        <h2 className="pd-section__title">Solutions</h2>
        <div className="pd-language-tabs">
          <button
            type="button"
            className={`pd-lang-tab${language === 'java' ? ' is-active' : ''}`}
            onClick={() => setLanguage('java')}
          >
            Java
          </button>
          {lastSolution.pythonCode && (
            <button
              type="button"
              className={`pd-lang-tab${language === 'python' ? ' is-active' : ''}`}
              onClick={() => setLanguage('python')}
            >
              Python
            </button>
          )}
        </div>
        {language === 'java' ? (
          <>
            <p className="pd-intro">
              Pick an approach below. Each tab shows the idea, idiomatic Java code, and its complexity.
            </p>
            <Tabs tabs={solutionTabs(content.solutions)} defaultTab={content.solutions[0]?.label} />
          </>
        ) : (
          <>
            {lastSolution.intuition && (
              <>
                <h4 className="pd-solution__label">Intuition</h4>
                <p className="pd-solution__desc">{lastSolution.intuition}</p>
              </>
            )}
            {lastSolution.algorithm && lastSolution.algorithm.length > 0 && (
              <>
                <h4 className="pd-solution__label">Algorithm</h4>
                <ol className="pd-algorithm">
                  {lastSolution.algorithm.map((step, si) => (
                    <li key={si}>{step.replace(/^\d+\.\s*/, '')}</li>
                  ))}
                </ol>
              </>
            )}
            {lastSolution.detailedWalkthrough && lastSolution.detailedWalkthrough.length > 0 && (
              <>
                <h4 className="pd-solution__label">Detailed Walkthrough</h4>
                <ol className="pd-algorithm">
                  {lastSolution.detailedWalkthrough.map((step, si) => (
                    <li key={si}>{step.replace(/^\d+\.\s*\*\*[^*]+\*\*\s*/, '').replace(/^\d+\.\s*/, '')}</li>
                  ))}
                </ol>
              </>
            )}
            {lastSolution.correctnessCheck && (
              <>
                <h4 className="pd-solution__label">Correctness Check</h4>
                <p className="pd-solution__desc">{lastSolution.correctnessCheck}</p>
              </>
            )}
            <CodeBlock title="Python — Optimal" description="Optimal Python solution" code={lastSolution.pythonCode ?? ''} />
            <ComplexityTable
              rows={[
                { operation: 'Time', best: lastSolution.pythonComplexity?.time ?? lastSolution.complexity.time, average: lastSolution.pythonComplexity?.time ?? lastSolution.complexity.time, worst: lastSolution.pythonComplexity?.time ?? lastSolution.complexity.time },
                { operation: 'Space', best: lastSolution.pythonComplexity?.space ?? lastSolution.complexity.space, average: lastSolution.pythonComplexity?.space ?? lastSolution.complexity.space, worst: lastSolution.pythonComplexity?.space ?? lastSolution.complexity.space },
              ]}
              caption="Optimal complexity"
            />
          </>
        )}
      </section>

      {/* Sticky LeetCode button (below sidebar, transparent circle, logo only) */}
      <a
        href={problem.leetcodeUrl}
        target="_blank"
        rel="noreferrer"
        className="pd-leetcode-sticky"
        aria-label={`Solve ${content.title} on LeetCode`}
      >
        <img src={LEETCODE_LOGO_URL} alt="LeetCode" width="24" height="24" />
      </a>
    </PageShell>
  );
}

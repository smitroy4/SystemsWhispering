import { Link, useParams } from 'react-router-dom';
import { usePageMeta } from '../utils/pageMeta.ts';
import { PageShell } from '../components/layout/index.ts';
import { Badge, CodeBlock, ComplexityTable, Tabs } from '../components/ui/index.ts';
import { renderMarkdownLite } from '../utils/markdownLite.tsx';
import { getProblem } from '../utils/content.ts';
import { problemContents } from '../content/problems/problemContents.ts';
import type { ProblemDifficulty } from '../types/content.ts';
import './ProblemDetailPage.css';

function difficultyTone(difficulty: ProblemDifficulty): 'success' | 'warning' | 'danger' {
  if (difficulty === 'Easy') return 'success';
  if (difficulty === 'Medium') return 'warning';
  return 'danger';
}

function solutionTabs(solutions: { label: string; intuition?: string; algorithm?: string[]; code: string; complexity: { time: string; space: string } }[]) {
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
                <li key={si}>{step}</li>
              ))}
            </ol>
          </>
        )}
        {!sol.intuition && !sol.algorithm && (
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
        <p className="pd-intro">
          Pick an approach below. Each tab shows the idea, idiomatic Java code, and its complexity.
        </p>
        <Tabs tabs={solutionTabs(content.solutions)} defaultTab={content.solutions[0]?.label} />
      </section>
    </PageShell>
  );
}

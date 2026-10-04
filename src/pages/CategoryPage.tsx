import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageShell } from '../components/layout/index.ts';
import { Badge } from '../components/ui/index.ts';
import type { TopicCategory, TopicLevel } from '../types/content.ts';
import { getAllTopics } from '../utils/content.ts';
import { usePageMeta } from '../utils/pageMeta.ts';
import TopicSidebar from './TopicSidebar.tsx';

interface CategoryPageProps {
  category: TopicCategory;
  title: string;
  description: string;
}

type LevelFilter = TopicLevel | 'all';

const FILTERS: Array<{ id: LevelFilter; label: string }> = [
  { id: 'all', label: 'All levels' },
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
  { id: 'expert', label: 'Expert' },
];

function levelTone(level: TopicLevel): 'success' | 'warning' | 'danger' | 'info' {
  if (level === 'beginner') return 'success';
  if (level === 'intermediate') return 'warning';
  if (level === 'advanced') return 'danger';
  return 'info';
}

/** Category index: grid of topic cards with a level filter. */
export default function CategoryPage({ category, title, description }: CategoryPageProps) {
  const [filter, setFilter] = useState<LevelFilter>('all');
  const topics = getAllTopics(category);
  const visible = filter === 'all' ? topics : topics.filter((t) => t.level === filter);

  usePageMeta(title, description);

  return (
    <PageShell
      title={title}
      description={description}
      sidebar={<TopicSidebar category={category} activeSlug="" />}
    >
      <div className="topic-filters" role="group" aria-label="Filter by level">
        {FILTERS.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`topic-filters__btn${filter === option.id ? ' topic-filters__btn--active' : ''}`}
            aria-pressed={filter === option.id}
            onClick={() => setFilter(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>

      {visible.length > 0 ? (
        <ul className="topic-grid">
          {visible.map((topic) => (
            <li key={topic.slug} className="topic-grid__card">
              <Link to={`/${category}/${topic.slug}`} className="topic-grid__link">
                {topic.title}
              </Link>
              <p className="topic-grid__summary">{topic.summary}</p>
              <div className="topic-grid__meta">
                <Badge tone={levelTone(topic.level)}>
                  {topic.level[0]?.toUpperCase() + topic.level.slice(1)}
                </Badge>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="placeholder">
          <h1>No {filter} topics yet</h1>
          <p>More topics land here as content is added.</p>
        </div>
      )}
    </PageShell>
  );
}

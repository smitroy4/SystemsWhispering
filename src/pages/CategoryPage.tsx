import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageShell } from '../components/layout/index.ts';
import { Badge } from '../components/ui/index.ts';
import type { Topic, TopicCategory, TopicLevel } from '../types/content.ts';
import { TOPIC_GROUP_META, TOPIC_GROUP_ORDER, getAllTopics, isDraftTopic } from '../utils/content.ts';
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

/** A single topic card with level + draft badges. */
function TopicCard({ category, topic }: { category: TopicCategory; topic: Topic }) {
  return (
    <li className="topic-grid__card">
      <Link to={`/${category}/${topic.slug}`} className="topic-grid__link">
        {topic.title}
      </Link>
      <p className="topic-grid__summary">{topic.summary}</p>
      <div className="topic-grid__meta">
        <Badge tone={levelTone(topic.level)}>
          {topic.level[0]?.toUpperCase() + topic.level.slice(1)}
        </Badge>
        {isDraftTopic(topic) ? <Badge>Coming soon</Badge> : null}
      </div>
    </li>
  );
}

/** Category index: grid of topic cards with a level filter. */
export default function CategoryPage({ category, title, description }: CategoryPageProps) {
  const [filter, setFilter] = useState<LevelFilter>('all');
  const topics = getAllTopics(category);
  const matchesFilter = (topic: Topic) => filter === 'all' || topic.level === filter;
  const visible = topics.filter(matchesFilter);
  /** Categories whose topics declare `group` render one section per group. */
  const grouped = topics.some((topic) => topic.group !== undefined);

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

      {visible.length === 0 ? (
        <div className="placeholder">
          <h1>No {filter} topics yet</h1>
          <p>More topics land here as content is added.</p>
        </div>
      ) : grouped ? (
        TOPIC_GROUP_ORDER.map((group) => {
          const groupTopics = topics.filter((t) => t.group === group);
          if (groupTopics.length === 0) return null;
          const groupVisible = groupTopics.filter(matchesFilter);
          const meta = TOPIC_GROUP_META[group];
          return (
            <section key={group} className="topic-group" aria-label={meta.title}>
              <div className="topic-group__header">
                <h2 className="topic-group__title">
                  {meta.title}
                  <span className="topic-group__count">
                    {groupTopics.length} {groupTopics.length === 1 ? 'topic' : 'topics'}
                  </span>
                </h2>
                <p className="topic-group__description">{meta.description}</p>
              </div>
              {groupVisible.length > 0 ? (
                <ul className="topic-grid">
                  {groupVisible.map((topic) => (
                    <TopicCard key={topic.slug} category={category} topic={topic} />
                  ))}
                </ul>
              ) : (
                <p className="topic-group__empty">No {filter} topics in this group yet.</p>
              )}
            </section>
          );
        })
      ) : (
        <ul className="topic-grid">
          {visible.map((topic) => (
            <TopicCard key={topic.slug} category={category} topic={topic} />
          ))}
        </ul>
      )}
    </PageShell>
  );
}

import { NavLink } from 'react-router-dom';
import type { TopicCategory, TopicLevel } from '../types/content.ts';
import { getAllTopics } from '../utils/content.ts';

interface TopicSidebarProps {
  category: TopicCategory;
  activeSlug: string;
}

const LEVEL_ORDER: TopicLevel[] = ['beginner', 'intermediate', 'advanced', 'expert'];

const LEVEL_HEADINGS: Record<TopicLevel, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  expert: 'Expert',
};

/** Topic index for category pages: ordered by `order`, grouped by level. */
export default function TopicSidebar({ category, activeSlug }: TopicSidebarProps) {
  const topics = getAllTopics(category);

  return (
    <aside className="topic-sidebar" aria-label="Topics in this section">
      {LEVEL_ORDER.map((level) => {
        const group = topics.filter((t) => t.level === level);
        if (group.length === 0) return null;
        return (
          <div key={level} className="topic-sidebar__section">
            <h2 className="topic-sidebar__heading">
              {LEVEL_HEADINGS[level]}
              <span className="topic-sidebar__count">{group.length}</span>
            </h2>
            <ul className="topic-sidebar__list">
              {group.map((topic) => (
                <li key={topic.slug}>
                  <NavLink
                    to={`/${category}/${topic.slug}`}
                    className={({ isActive }) =>
                      `topic-sidebar__link${isActive || topic.slug === activeSlug ? ' topic-sidebar__link--active' : ''}`
                    }
                  >
                    {topic.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
      {topics.length === 0 ? (
        <p className="topic-sidebar__empty">Topics land here as content is added.</p>
      ) : null}
    </aside>
  );
}

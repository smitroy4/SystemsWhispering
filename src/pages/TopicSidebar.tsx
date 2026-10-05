import { NavLink } from 'react-router-dom';
import type { Topic, TopicCategory, TopicLevel } from '../types/content.ts';
import { TOPIC_GROUP_META, TOPIC_GROUP_ORDER, getAllTopics, isDraftTopic } from '../utils/content.ts';

/** Props for the sidebar component. */
interface TopicSidebarProps {
  category: TopicCategory;
  activeSlug: string;
}

/** Order of levels for grouping. */
const LEVEL_ORDER: TopicLevel[] = ['beginner', 'intermediate', 'advanced', 'expert'];

/** Human‑readable headings for each level. */
const LEVEL_HEADINGS: Record<TopicLevel, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  expert: 'Expert',
};

/** One sidebar link row. Draft stubs carry a subtle "soon" marker. */
function SidebarLink({ category, topic, activeSlug }: { category: TopicCategory; topic: Topic; activeSlug: string }) {
  return (
    <li key={topic.slug}>
      <NavLink
        to={`/${category}/${topic.slug}`}
        className={({ isActive }) =>
          `topic-sidebar__link${isActive || topic.slug === activeSlug ? ' topic-sidebar__link--active' : ''}`
        }
      >
        {topic.title}
        {isDraftTopic(topic) ? <span className="topic-sidebar__soon">soon</span> : null}
      </NavLink>
    </li>
  );
}

/** Level subgroups inside one group (or the whole category when ungrouped). */
function LevelGroups({ category, topics, activeSlug }: { category: TopicCategory; topics: Topic[]; activeSlug: string }) {
  return (
    <>
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
                <SidebarLink key={topic.slug} category={category} topic={topic} activeSlug={activeSlug} />
              ))}
            </ul>
          </div>
        );
      })}
    </>
  );
}

/** Topic index for category pages: ordered by `order`, grouped by level. */
export default function TopicSidebar({ category, activeSlug }: TopicSidebarProps) {
  const topics = getAllTopics(category);
  /** Categories whose topics declare `group` nest level groups under group headings. */
  const grouped = topics.some((topic) => topic.group !== undefined);

  return (
    <aside className="topic-sidebar" aria-label="Topics in this section">
      {grouped ? (
        TOPIC_GROUP_ORDER.map((group) => {
          const groupTopics = topics.filter((t) => t.group === group);
          if (groupTopics.length === 0) return null;
          const meta = TOPIC_GROUP_META[group];
          return (
            <div key={group} className="topic-sidebar__section">
              <h2 className="topic-sidebar__heading">
                {meta.title}
                <span className="topic-sidebar__count">{groupTopics.length}</span>
              </h2>
              <LevelGroups category={category} topics={groupTopics} activeSlug={activeSlug} />
            </div>
          );
        })
      ) : (
        <LevelGroups category={category} topics={topics} activeSlug={activeSlug} />
      )}
      {topics.length === 0 ? (
        <p className="topic-sidebar__empty">Topics land here as content is added.</p>
      ) : null}
    </aside>
  );
}

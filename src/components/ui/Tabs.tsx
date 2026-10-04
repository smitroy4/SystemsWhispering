import { useState } from 'react';
import type { ReactNode } from 'react';
import './ui.css';

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
}

export default function Tabs({ tabs, defaultTab }: TabsProps) {
  const [activeId, setActiveId] = useState(defaultTab ?? tabs[0]?.id);
  const active = tabs.find((t) => t.id === activeId) ?? tabs[0];

  if (tabs.length === 0) return null;

  return (
    <div className="ui-tabs">
      <div className="ui-tabs__list" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={tab.id === active?.id}
            className={`ui-tabs__tab${tab.id === active?.id ? ' ui-tabs__tab--active' : ''}`}
            onClick={() => setActiveId(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="ui-tabs__panel" role="tabpanel">
        {active?.content}
      </div>
    </div>
  );
}

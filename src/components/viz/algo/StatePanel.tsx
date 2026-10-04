import './statePanel.css';

export interface StateEntry {
  label: string;
  value: string;
}

interface StatePanelProps {
  title?: string;
  entries: StateEntry[];
}

/**
 * Side panel showing live algorithm variables (pointers, queue/stack
 * contents, visited sets). Purely presentational: every entry is a
 * string computed by the viz step builder.
 */
export default function StatePanel({ title = 'State', entries }: StatePanelProps) {
  return (
    <aside className="state-panel" aria-label={title}>
      <h3 className="state-panel__title">{title}</h3>
      <dl className="state-panel__list">
        {entries.map((entry) => (
          <div className="state-panel__row" key={entry.label}>
            <dt className="state-panel__label">{entry.label}</dt>
            <dd className="state-panel__value">{entry.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}

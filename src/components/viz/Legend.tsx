import type { CellTone } from './primitives.tsx';

export interface LegendItem {
  tone: CellTone;
  label: string;
  hint?: string;
}

const DEFAULT_ITEMS: LegendItem[] = [
  { tone: 'default', label: 'Default', hint: 'Not visited yet' },
  { tone: 'active', label: 'Active', hint: 'Current element' },
  { tone: 'compared', label: 'Compared', hint: 'Being compared' },
  { tone: 'swapped', label: 'Swapped / Found', hint: 'Swapped or target found' },
  { tone: 'done', label: 'Done', hint: 'Finished / settled' },
];

interface LegendProps {
  items?: LegendItem[];
  title?: string;
}

/** Color legend for visualizations. Generic: tones + labels only. */
export default function Legend({ items = DEFAULT_ITEMS, title = 'Legend' }: LegendProps) {
  return (
    <div className="viz-legend">
      <h2 className="viz-legend__title">{title}</h2>
      <ul className="viz-legend__list">
        {items.map((item) => (
          <li key={item.tone} className="viz-legend__item">
            <span className={`viz-legend__swatch viz-tone-${item.tone}`} aria-hidden="true" />
            <span>{item.label}</span>
            {item.hint ? <span className="viz-legend__hint">({item.hint})</span> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

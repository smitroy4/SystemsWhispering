/**
 * VisualBlock: renders one visualization inline, right after the section it
 * explains. It owns the title, caption, "what to notice" note, and the
 * visual component (animated VizPlayer-driven or static hover/click).
 *
 * Props:
 *   spec - { title, caption, notice, component }
 */

import type { ComponentType } from 'react';

export interface JavaVisualSpec {
  /** Short title shown above the visual. */
  title: string;
  /** One-line caption shown under the title. */
  caption: string;
  /** "What to notice" note shown under the visual. */
  notice?: string;
  /** The React component to render (animated VizPlayer or static SVG). */
  component: ComponentType;
}

interface VisualBlockProps {
  spec: JavaVisualSpec;
}

export default function VisualBlock({ spec }: VisualBlockProps) {
  const { title, caption, notice, component: Component } = spec;
  return (
    <div className="java-visual-block" aria-labelledby={`viz-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="java-visual-block__header">
        <h3 className="java-visual-block__title">{title}</h3>
        <p className="java-visual-block__caption">{caption}</p>
      </div>
      <div className="java-visual-block__stage" aria-label={title}>
        <Component />
      </div>
      {notice ? (
        <p className="java-visual-block__notice" aria-live="polite">
          <strong>What to notice:</strong> {notice}
        </p>
      ) : null}
    </div>
  );
}

import type { ReactNode } from 'react';
import './ui.css';

interface CardProps {
  title?: string;
  children: ReactNode;
}

export default function Card({ title, children }: CardProps) {
  return (
    <section className="ui-card">
      {title ? <h2 className="ui-card__title">{title}</h2> : null}
      <div className="ui-card__body">{children}</div>
    </section>
  );
}

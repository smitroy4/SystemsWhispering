import type { ReactNode } from 'react';
import './ui.css';

interface BadgeProps {
  children: ReactNode;
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

export default function Badge({ children, tone = 'default' }: BadgeProps) {
  return <span className={`ui-badge ui-badge--${tone}`}>{children}</span>;
}

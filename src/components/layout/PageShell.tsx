import type { ReactNode } from 'react';
import Sidebar from './Sidebar.tsx';
import './PageShell.css';

interface PageShellProps {
  title: string;
  description?: string;
  children?: ReactNode;
  /** Custom sidebar (e.g. topic index). Defaults to the section Sidebar. */
  sidebar?: ReactNode;
}

/**
 * Standard page wrapper: title block + optional sidebar layout.
 * Topic pages will later follow Intro → Viz → Code → Complexity →
 * Mistakes → Problems inside this shell.
 */
export default function PageShell({ title, description, children, sidebar }: PageShellProps) {
  return (
    <div className="page-shell">
      <div className="page-shell__content">
        <header className="page-shell__header">
          <h1 className="page-shell__title">{title}</h1>
          {description ? <p className="page-shell__desc">{description}</p> : null}
        </header>
        {children}
      </div>
      {sidebar ?? <Sidebar />}
    </div>
  );
}

import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import type { ThemeMode } from '../../utils/theme.ts';
import SearchBox from './SearchBox.tsx';
import './Navbar.css';

interface NavbarProps {
  mode: ThemeMode;
  onCycleTheme: () => void;
}

const MODE_LABEL: Record<ThemeMode, string> = {
  system: 'System (follows device)',
  light: 'Light',
  dark: 'Dark',
};

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  );
}

const NAV_LINKS = [
  { to: '/data-structures', label: 'Data Structures' },
  { to: '/algorithms', label: 'Algorithms' },
  { to: '/concepts', label: 'Concepts' },
  { to: '/problems', label: 'Problems' },
  { to: '/lld', label: 'Low-Level Design' },
];

export default function Navbar({ mode, onCycleTheme }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand" onClick={() => setMenuOpen(false)}>
          Systems <span className="navbar__brand-accent">Whispering</span>
        </Link>

        <button
          type="button"
          className="navbar__menu-button"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <nav
          id="primary-navigation"
          className={`navbar__nav${menuOpen ? ' navbar__nav--open' : ''}`}
          aria-label="Primary"
        >
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `navbar__link${isActive ? ' navbar__link--active' : ''}`
              }
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <div className="navbar__search">
            <SearchBox onNavigate={() => setMenuOpen(false)} />
          </div>
        </nav>

        <button
          type="button"
          className={`navbar__theme-toggle navbar__theme-toggle--${mode}`}
          onClick={onCycleTheme}
          aria-label={`Theme: ${MODE_LABEL[mode]}. Activate to switch theme.`}
          title={`Theme: ${MODE_LABEL[mode]} — activate to switch theme`}
        >
          <span className="navbar__theme-icon" aria-hidden="true">
            <SunIcon />
          </span>
          <span className="navbar__theme-thumb" aria-hidden="true" />
          <span className="navbar__theme-icon" aria-hidden="true">
            <MoonIcon />
          </span>
        </button>
      </div>
    </header>
  );
}

import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
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

interface NavMenuItem {
  label: string;
  /** Omitted while the section has no route yet — renders as a "soon" row. */
  to?: string;
}

interface NavMenu {
  label: string;
  items: NavMenuItem[];
}

const NAV_MENUS: NavMenu[] = [
  {
    label: 'Data Structures & Algorithms',
    items: [
      { label: 'Data Structures', to: '/data-structures' },
      { label: 'Algorithms', to: '/algorithms' },
      { label: 'Concepts', to: '/concepts' },
      { label: 'Problems', to: '/problems' },
      { label: 'Sheets', to: '/sheets' },
    ],
  },
  {
    label: 'System Design',
    items: [
      { label: 'Low-level Design', to: '/lld' },
      { label: 'High-level Design' },
    ],
  },
  {
    label: 'The Backend Craft',
    items: [
      { label: 'Spring: Systems Bloom' },
      { label: 'Cloud-native Architecture' },
      { label: 'The Persistence Layer' },
    ],
  },
  {
    label: 'AI & ML',
    items: [
      { label: 'AI Fundamentals' },
      { label: 'LLMs & Generative AI' },
      { label: 'RAG & AI Applications' },
      { label: 'AI Engineering & Agents' },
    ],
  },
];

export default function Navbar({ mode, onCycleTheme }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const location = useLocation();

  const closeMenus = () => {
    setMenuOpen(false);
    setOpenMenu(null);
  };

  const menuActive = (menu: NavMenu): boolean =>
    menu.items.some(
      (item) =>
        item.to !== undefined &&
        (location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)),
    );

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand" onClick={closeMenus}>
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
          {NAV_MENUS.map((menu) => {
            const isOpen = openMenu === menu.label;
            return (
              <div
                key={menu.label}
                className="navbar__dropdown"
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                    setOpenMenu(null);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setOpenMenu(null);
                }}
              >
                <button
                  type="button"
                  className={`navbar__link navbar__dropdown-toggle${menuActive(menu) ? ' navbar__link--active' : ''}`}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  onClick={() => setOpenMenu(isOpen ? null : menu.label)}
                >
                  {menu.label} <span className="navbar__caret" aria-hidden="true" />
                </button>
                {isOpen ? (
                  <div className="navbar__dropdown-menu" role="menu" aria-label={menu.label}>
                    {menu.items.map((item) =>
                      item.to ? (
                        <NavLink
                          key={item.label}
                          to={item.to}
                          role="menuitem"
                          className={({ isActive }) =>
                            `navbar__link${isActive ? ' navbar__link--active' : ''}`
                          }
                          onClick={closeMenus}
                        >
                          {item.label}
                        </NavLink>
                      ) : (
                        <span
                          key={item.label}
                          role="menuitem"
                          aria-disabled="true"
                          className="navbar__link navbar__link--disabled"
                        >
                          {item.label} <span className="navbar__soon">soon</span>
                        </span>
                      ),
                    )}
                  </div>
                ) : null}
              </div>
            );
          })}
          <div className="navbar__search">
            <SearchBox onNavigate={closeMenus} />
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

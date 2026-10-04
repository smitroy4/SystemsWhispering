import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const SECTIONS = [
  {
    heading: 'Learn',
    links: [
      { to: '/data-structures', label: 'Data Structures' },
      { to: '/algorithms', label: 'Algorithms' },
      { to: '/concepts', label: 'Concepts' },
    ],
  },
  {
    heading: 'Practice',
    links: [
      { to: '/problems', label: 'Problems' },
      { to: '/sheets', label: 'Sheets' },
    ],
  },
];

export default function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Section navigation">
      {SECTIONS.map((section) => (
        <div key={section.heading} className="sidebar__section">
          <h2 className="sidebar__heading">{section.heading}</h2>
          <ul className="sidebar__list">
            {section.links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <p className="sidebar__note">Topic indexes land here in a later step.</p>
    </aside>
  );
}

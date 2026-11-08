import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import ThemeAwareLogo from './ThemeAwareLogo.tsx';
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

function SocialIcon({ href, ariaLabel, children }: { href: string; ariaLabel: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className="sidebar__social-link"
    >
      {children}
    </a>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-.929 3.29-1.23 3.29-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.64-1.22 2.2-2.5 4.51-2.5 4.817 0 5.686 3.163 5.686 7.298v5.723zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.143 0 2.064.925 2.064 2.063 0 1.141-.921 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 9.355-3.308.897-8.444-9.245L4.16 22.253.853 21.31 9.284 12.108.982 3.044 4.294 3.94 13.532 13.322 4.078 3.985l8.552-9.313 3.295-.884-7.243 9.267L23.147 2.25h-3.296z"/>
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-1-12.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5.5 1.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm-5.5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 5.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5.5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"/>
    </svg>
  );
}

export default function Sidebar() {
  const location = useLocation();
  const isHome = location.pathname === '/';

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
      {isHome && (
        <div className="sidebar__creator">
          <div className="sidebar__creator-avatar">
            <ThemeAwareLogo className="java-logo" alt="Smit Roy" width={48} height={48} />
          </div>
          <div className="sidebar__creator-info">
            <h3 className="sidebar__creator-name">Smit Roy</h3>
            <p className="sidebar__creator-desc">Whispering to Systems</p>
          </div>
          <div className="sidebar__creator-links">
            <SocialIcon href="https://smitroy.com" ariaLabel="Website - smitroy.com">
              <GlobeIcon />
            </SocialIcon>
            <SocialIcon href="https://linkedin.com/in/smitroy22" ariaLabel="LinkedIn - smitroy22">
              <LinkedInIcon />
            </SocialIcon>
            <SocialIcon href="https://github.com/smitroy4" ariaLabel="GitHub - smitroy4">
              <GithubIcon />
            </SocialIcon>
            <SocialIcon href="https://x.com/smitroy22" ariaLabel="X - smitroy22">
              <XIcon />
            </SocialIcon>
          </div>
        </div>
      )}
      {!isHome && <p className="sidebar__note">Topic indexes land here in a later step.</p>}
    </aside>
  );
}
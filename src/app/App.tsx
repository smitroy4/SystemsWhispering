import { Footer, Navbar, GoToTopButton } from '../components/layout/index.ts';
import { useTheme } from '../utils/theme.ts';
import AppRoutes from './routes.tsx';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import './App.css';

export default function App() {
  const { mode, cycleMode } = useTheme();
  const location = useLocation();

  /** Scroll to the top of the page on every route change so no page
   * lands mid-scroll from a previous page's position. */
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navbar mode={mode} onCycleTheme={cycleMode} />
      <main id="main" className="main-content">
        <div className="container">
          <AppRoutes />
        </div>
      </main>
      <GoToTopButton />
      <Footer />
    </>
  );
}

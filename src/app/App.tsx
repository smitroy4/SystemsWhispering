import { Footer, Navbar } from '../components/layout/index.ts';
import { useTheme } from '../utils/theme.ts';
import AppRoutes from './routes.tsx';
import './App.css';

export default function App() {
  const { mode, cycleMode } = useTheme();

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
      <Footer />
    </>
  );
}

import { useCallback, useEffect, useState } from 'react';
import './GoToTopButton.css';

/** Classic aesthetic "Go to Top" button. Fixed at bottom-left, shown after
   the user scrolls down. Uses theme colors throughout. */
export default function GoToTopButton() {
  const [visible, setVisible] = useState(false);

  const handleScroll = useCallback(() => {
    setVisible(window.scrollY > 200);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <button
      type="button"
      className={`goto-top${visible ? ' goto-top--visible' : ''}`}
      aria-label="Go to top"
      title="Go to top"
      onClick={scrollToTop}
    >
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 19V5M12 5l-4 4M12 5l4 4" />
      </svg>
    </button>
  );
}

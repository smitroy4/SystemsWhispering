import './Footer.css';
import ThemeAwareLogo from './ThemeAwareLogo.tsx';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p className="footer__text">
          <ThemeAwareLogo className="footer__logo" alt="Systems Whispering" width={24} height={24} />
          <span className="footer__brand">Systems Whispering</span> — Learn the
          craft. Whisper to systems.
        </p>
      </div>
    </footer>
  );
}

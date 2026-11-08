import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p className="footer__text">
          <img src="/sw-logo.png" alt="" className="footer__logo" />
          <span className="footer__brand">Systems Whispering</span> — Learn the
          craft. Whisper to systems.
        </p>
      </div>
    </footer>
  );
}

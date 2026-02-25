import "/src/components/Footer.scss";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner">

        {/* Brand */}
        <div className="footer__brand">
          <a href="/" className="footer__logo">
            <span className="footer__logo-icon">
              <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 4C16 4 8 10 8 18a8 8 0 0016 0c0-8-8-14-8-14z" fill="currentColor" opacity="0.9"/>
                <path d="M16 12C16 12 11 16 11 21a5 5 0 0010 0c0-5-5-9-5-9z" fill="white" opacity="0.5"/>
              </svg>
            </span>
            Dietetica
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer__bottom">
        <div className="footer__bottom-inner">
          <span>© {year} Dietetica — Tous droits réservés</span>
        </div>
      </div>
    </footer>
  );
}

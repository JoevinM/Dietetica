import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "/src/components/Header.scss";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header__inner">
        {/* Logo */}
        <a href="/" className="header__logo">
          <span className="header__logo-icon">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 4C16 4 8 10 8 18a8 8 0 0016 0c0-8-8-14-8-14z" fill="currentColor" opacity="0.85"/>
              <path d="M16 12C16 12 11 16 11 21a5 5 0 0010 0c0-5-5-9-5-9z" fill="white" opacity="0.6"/>
            </svg>
          </span>
          <span className="header__logo-text">Dietetica</span>
        </a>

        {/* Desktop Nav */}
        <nav className="header__nav">
          <a href="/" className="header__nav-link header__nav-link--active">Accueil</a>
          <a href="/NewLetter" className="header__nav-link">Article</a>
          <a href="/recettes" className="header__nav-link">Recettes</a>
          <a href="/profil" className="header__nav-link">Mon profil</a>
          <a href="/dashboard" className="header__nav-link">Mes patients</a>
          <a href="/contact" className="header__nav-link">Contact</a>
        </nav>

        {/* Auth Buttons */}
        <div className="header__auth">
          {user ? (
            <>
              <span className="header__welcome">Bonjour {user.name}</span>
              <button onClick={handleLogout} className="btn btn--ghost">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <a href="/login" className="btn btn--ghost">Connexion</a>
              <a href="/register" className="btn btn--solid">Commencer</a>
            </>
          )}
        </div>

        {/* Burger */}
        <button
          className={`header__burger ${menuOpen ? "header__burger--open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`header__mobile-menu ${menuOpen ? "header__mobile-menu--open" : ""}`}>
        <nav className="header__mobile-nav">
          <a href="/" onClick={() => setMenuOpen(false)}>Accueil</a>
          <a href="/programmes" onClick={() => setMenuOpen(false)}>Programmes</a>
          <a href="/recettes" onClick={() => setMenuOpen(false)}>Recettes</a>
          <a href="/profil" onClick={() => setMenuOpen(false)}>Mon profil</a>
          <a href="/dashboard" onClick={() => setMenuOpen(false)}>Mes patients</a>
          <a href="/contact" onClick={() => setMenuOpen(false)}>Contact</a>
        </nav>
        <div className="header__mobile-auth">
          {user ? (
            <button onClick={logout} className="btn btn--ghost">
              Déconnexion
            </button>
          ) : (
            <>
              <a href="/login" className="btn btn--ghost">Connexion</a>
              <a href="/register" className="btn btn--solid">Commencer</a>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

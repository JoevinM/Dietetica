import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "/src/components/Header.scss";
import { NavLink } from "react-router-dom";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const closeMenu = () => setMenuOpen(false);

  const navClass = ({ isActive }) =>
    isActive
      ? "header__nav-link header__nav-link--active"
      : "header__nav-link";

  const routes = [
    { path: "/", label: "Accueil", end: true },
    { path: "/newsletter", label: "Article" },
    { path: "/recettes", label: "Recettes" },
    { path: "/conseils", label: "Conseils" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <header className="header">
      <div className="header__inner">

        {/* Logo */}

        <NavLink to="/" end className="header__logo" onClick={closeMenu}>
          <span className="header__logo-icon">
            <svg viewBox="0 0 32 32" fill="none">
              <path
                d="M16 4C16 4 8 10 8 18a8 8 0 0016 0c0-8-8-14-8-14z"
                fill="currentColor"
                opacity="0.85"
              />
              <path
                d="M16 12C16 12 11 16 11 21a5 5 0 0010 0c0-5-5-9-5-9z"
                fill="white"
                opacity="0.6"
              />
            </svg>
          </span>
          <span className="header__logo-text">Dietetica</span>
        </NavLink>

        {/* Desktop Nav */}

        <nav className="header__nav">
          {routes.map(({ path, label, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              className={navClass}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Auth Buttons */}

        <div className="header__auth">
          {user ? (
            <>
              <span className="header__welcome">
                Bonjour {user.name}
              </span>

              <button onClick={handleLogout} className="btn btn--ghost">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="btn btn--ghost">
                Connexion
              </NavLink>

              <NavLink to="/register" className="btn btn--solid">
                Commencer
              </NavLink>
            </>
          )}
        </div>

        {/* Burger */}

        <button
          className={`header__burger ${menuOpen ? "header__burger--open" : ""}`}
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile Menu */}

      <div
        className={`header__mobile-menu ${
          menuOpen ? "header__mobile-menu--open" : ""
        }`}
      >
        <nav className="header__mobile-nav">
          {routes.map(({ path, label, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              onClick={closeMenu}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="header__mobile-auth">
          {user ? (
            <button onClick={logout} className="btn btn--ghost">
              Déconnexion
            </button>
          ) : (
            <>
              <NavLink to="/login" onClick={closeMenu} className="btn btn--ghost">
                Connexion
              </NavLink>

              <NavLink to="/register" onClick={closeMenu} className="btn btn--solid">
                Commencer
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

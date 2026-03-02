import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "/src/components/Header.scss";
import { NavLink } from "react-router-dom";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [konamiUnlocked, setKonamiUnlocked] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

        {/* Logout */}

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const closeMenu = () => setMenuOpen(false);

        {/* Nav class Active */}

  const navClass = ({ isActive }) =>
    isActive
      ? "header__nav-link header__nav-link--active"
      : "header__nav-link";

        {/* Routes */}

  const routes = [
    { path: "/", label: "Accueil", end: true },
    { path: "/newsletter", label: "Article" },
    { path: "/google", label: "Rendez-vous" },
    { path: "/profil", label: "Profil" },
    { path: "/gestion", label: "Gestion" },
    { path: "/contact", label: "Contact" },
  ];

  // Konami Code detector
  useEffect(() => {
    const konami = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
    ];

    let index = 0;

    const handler = (e) => {
      if (e.key.toLowerCase() === konami[index].toLowerCase()) {
        index++;

        if (index === konami.length) {
          setKonamiUnlocked(true);
          index = 0;
        }
      } else {
        index = 0;
      }
    };

    window.addEventListener("keydown", handler);

    return () => window.removeEventListener("keydown", handler);
  }, []);

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
          {konamiUnlocked ? (
              <svg
              className="burger-svg"
              viewBox="0 -80 501.639 660"
              xmlns="http://www.w3.org/2000/svg"
              >

              <g className="bun-top">
                  <path d="M293.417,0.153h-85.333c-113.067,0-204.8,91.733-205.867,204.8v5.333c0,11.733,9.6,21.333,21.333,21.333h454.4
                  c10.667,0,20.267-9.6,21.333-20.267v-5.333C499.284,91.886,406.483,0.153,293.417,0.153z M45.95,190.019
                  c7.467-83.2,77.867-148.267,162.133-148.267h85.333c84.267,0,154.667,65.067,163.2,148.267H45.95z"/>
              </g>

              <g className="ingredients">
                  <path d="M492.883,305.22l-40.533-28.8c-27.733-20.267-66.133-20.267-93.867,0l-4.267,3.2c-13.867,9.6-33.067,9.6-45.867,0
                  l-8.533-6.4c-27.733-20.267-66.133-20.267-93.867,0l-12.8,9.6c-13.867,9.6-33.067,9.6-45.867,0c-25.6-19.2-61.867-20.267-89.6-3.2
                  l-46.933,28.8c-10.667,6.4-13.867,19.2-7.467,28.8c4.267,6.4,10.666,9.6,18.133,9.6c3.2,0,7.467-1.067,10.667-3.2l46.933-28.8
                  c13.867-8.533,32-7.467,43.733,1.067c27.733,20.267,66.133,20.267,93.867,0l12.8-9.6c13.867-9.6,33.067-9.6,45.867,0l8.533,6.4
                  c27.733,20.267,66.133,20.267,93.867,0l4.267-3.2c13.867-9.6,33.067-9.6,45.867,0l40.533,28.8c8.533,7.467,22.4,5.333,28.8-4.267
                  C504.616,325.487,502.483,311.62,492.883,305.22z"/>
              </g>

              <g className="bun-bottom">
                  <path d="M493.95,373.486c-4.267-5.333-10.667-8.533-17.067-8.533H23.55c-6.4,0-12.8,3.2-17.067,8.533
                  c-4.267,6.4-5.333,12.8-3.2,19.2l12.8,38.4c13.867,41.6,51.2,70.4,93.867,70.4h281.6c41.6,0,80-28.8,93.867-70.4l11.733-38.4
                  C499.284,386.286,498.217,378.82,493.95,373.486z M444.884,418.286c-8.533,24.533-29.867,41.6-54.4,41.6H109.95
                  c-24.533,0-46.933-17.067-54.4-41.6l-3.2-11.733h395.733L444.884,418.286z"/>
              </g>

              </svg>
          ) : (
            <>
              <span />
              <span />
              <span />
            </>
          )}
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

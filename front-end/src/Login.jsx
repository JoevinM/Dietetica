import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import api from "./services/api";
import "/src/Login.scss";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(null);
  const { login } = useAuth(); // utiliser le login du contexte

  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const { data } = await api.post("/auth/login", form);
    login(data.user);
    navigate("/", {replace: true});
  } catch (err) {
    console.error("Erreur de connexion :", err.response?.data?.message);
  }
};

  return (
    <div className="login">

      {/* ── Panneau gauche : illustration ── */}
      <div className="login__panel">
        <div className="login__panel-content">

          {/* Cercles décoratifs */}
          <div className="login__orb login__orb--1" />
          <div className="login__orb login__orb--2" />
          <div className="login__orb login__orb--3" />

          {/* Icônes flottantes */}
          <div className="login__float login__float--1">
            <svg viewBox="0 0 64 64" fill="none">
              <path d="M32 8C32 8 16 20 16 36a16 16 0 0032 0c0-16-16-28-16-28z" fill="white" opacity="0.25"/>
              <path d="M32 24C32 24 22 32 22 42a10 10 0 0020 0c0-10-10-18-10-18z" fill="white" opacity="0.4"/>
            </svg>
          </div>
          <div className="login__float login__float--2">
            <svg viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="20" stroke="white" strokeWidth="1.5" opacity="0.3"/>
              <path d="M24 12C24 12 14 20 14 28a10 10 0 0020 0c0-8-10-16-10-16z" fill="white" opacity="0.35"/>
            </svg>
          </div>
          <div className="login__float login__float--3">
            <svg viewBox="0 0 32 32" fill="none">
              <path d="M4 28C4 28 4 16 16 8c12 8 12 20 12 20H4z" fill="white" opacity="0.2"/>
              <path d="M16 8v20" stroke="white" strokeWidth="1.5" opacity="0.4" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Texte éditorial */}
          <div className="login__panel-text">
            <span className="login__panel-eyebrow">Votre espace santé</span>
            <h2 className="login__panel-title">
              Chaque repas<br/>
              est une<br/>
              <em>opportunité</em>
            </h2>
            <p className="login__panel-sub">
              Rejoignez des milliers de personnes qui transforment leur quotidien grâce à une alimentation consciente.
            </p>

            <div className="login__stats">
              <div className="login__stat">
                <span className="login__stat-num">12k+</span>
                <span className="login__stat-label">Membres actifs</span>
              </div>
              <div className="login__stat-divider" />
              <div className="login__stat">
                <span className="login__stat-num">340+</span>
                <span className="login__stat-label">Recettes saines</span>
              </div>
              <div className="login__stat-divider" />
              <div className="login__stat">
                <span className="login__stat-num">98%</span>
                <span className="login__stat-label">Satisfaction</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Panneau droit : formulaire ── */}
      <div className="login__form-panel">
        <div className="login__form-wrapper">

          {/* Logo */}
          <a href="/" className="login__logo">
            <span className="login__logo-icon">
              <svg viewBox="0 0 32 32" fill="none">
                <path d="M16 4C16 4 8 10 8 18a8 8 0 0016 0c0-8-8-14-8-14z" fill="currentColor" opacity="0.9"/>
                <path d="M16 12C16 12 11 16 11 21a5 5 0 0010 0c0-5-5-9-5-9z" fill="white" opacity="0.5"/>
              </svg>
            </span>
            Dietetica
          </a>

          {/* Titre */}
          <div className="login__heading">
            <h1>Bon retour <span>👋</span></h1>
            <p>Connectez-vous à votre espace bien-être</p>
          </div>

          {/* Formulaire */}
          <form className="login__form" onSubmit={handleSubmit} noValidate>

            {/* Email */}
            <div className={`login__field ${focused === "email" ? "login__field--focused" : ""} ${form.email ? "login__field--filled" : ""}`}>
              <label htmlFor="email">Adresse e-mail</label>
              <div className="login__input-wrap">
                <span className="login__input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="vous@exemple.com"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                />
              </div>
            </div>

            {/* Password */}
            <div className={`login__field ${focused === "password" ? "login__field--focused" : ""} ${form.password ? "login__field--filled" : ""}`}>
              <div className="login__field-header">
                <label htmlFor="password">Mot de passe</label>
                <a href="/forgot-password" className="login__forgot">Mot de passe oublié ?</a>
              </div>
              <div className="login__input-wrap">
                <span className="login__input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                />
                <button
                  type="button"
                  className="login__eye"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Masquer" : "Afficher"}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="login__remember">
              <input type="checkbox" />
              <span className="login__checkbox-custom" />
              <span>Se souvenir de moi</span>
            </label>

            {/* Submit */}
            <button type="submit" className="login__submit">
              <span>Se connecter</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>

            {/* Divider */}
            <div className="login__divider"><span>ou</span></div>

            {/* Social login */}
            <div className="login__socials">
              <button type="button" className="login__social-btn">
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continuer avec Google
              </button>
            </div>

          </form>

          {/* Footer link */}
          <p className="login__register">
            Pas encore de compte ?{" "}
            <a href="/register">Créer un compte gratuitement</a>
          </p>

        </div>
      </div>
    </div>
  );
}

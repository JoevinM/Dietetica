import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import api from "./services/api";
import "/src/Login.scss";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(null);
  const { login } = useAuth();

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(form.email, form.password);
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Erreur de connexion :", err.response?.data?.message);
    }
  };

  return (
    <div className="login__form-panel">
      <div className="login__form-wrapper">

        <div className="login__heading">
          <h1>Connectez-vous</h1>
        </div>

        <form className="login__form" onSubmit={handleSubmit} noValidate>

          {/* Email */}
          <div
            className={`login__field ${
              focused === "email" ? "login__field--focused" : ""
            } ${form.email ? "login__field--filled" : ""}`}
          >
            <label htmlFor="email">Adresse e-mail</label>

            <div className="login__input-wrap">
              <span className="login__input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
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
          <div
            className={`login__field ${
              focused === "password" ? "login__field--focused" : ""
            } ${form.password ? "login__field--filled" : ""}`}
          >
            <div className="login__field-header">
              <label htmlFor="password">Mot de passe</label>
            </div>

            <div className="login__input-wrap">
              <span className="login__input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
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
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="login__submit">
            <span>Se connecter</span>

            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </form>

        <p className="login__register">
          Pas encore de compte ? <a href="/register">Créer un compte gratuitement</a>
        </p>

      </div>
    </div>
  );
}

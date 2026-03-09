import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Register.scss";

export default function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [form, setForm] = useState({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      birth_date: "",
      height: "",
    });

    const [focused, setFocused] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

    // Vérifier si un champ est vide
    const hasEmptyField = Object.values(form).some(
      (value) => value === "" || value === null
    );

    if (hasEmptyField) {
      alert("Tous les champs doivent être remplis");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.email)) {
      alert("Veuillez entrer une adresse email valide.");
      return;
    }

    const heightValue = parseInt(form.height, 10);

    if (Number.isNaN(heightValue) || heightValue < 50 || heightValue > 250) {
        alert("La taille doit être comprise entre 50 et 250 cm.");
        return;
    }

    try {
      const payload = {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        password: form.password,
        birth_date: form.birth_date,
        height: heightValue,
      };

       await register(payload);
    navigate("/", { replace: true });
  } catch (err) {
    const status = err?.response?.status;
    const message = err?.response?.data?.message;

    if (status === 409) {
      alert("Un utilisateur existe déjà avec cette adresse email.");
      return;
    }

    if (message?.toLowerCase().includes("already exists")) {
      alert("Un utilisateur existe déjà avec cette adresse email.");
      return;
    }

    console.error("Erreur inscription :", err?.response?.data || err?.message || err);
    alert("Une erreur est survenue lors de l'inscription.");
  }
};

  const fieldClass = (name, value) =>
    `register__field ${focused === name ? "register__field--focused" : ""} ${
      value ? "register__field--filled" : ""
    }`;

  return (
    <div className="register__form-panel">
      <div className="register__form-wrapper">
        <div className="register__heading">
          <h1>Créer un compte</h1>
        </div>

        <form className="register__form" onSubmit={handleSubmit} noValidate>
          {/* First Name */}
          <div className={fieldClass("first_name", form.first_name)}>
            <label htmlFor="first_name">Prénom</label>
            <div className="register__input-wrap register__input-wrap--noicon">
              <input
                id="first_name"
                name="first_name"
                placeholder="Robinson"
                value={form.first_name}
                onChange={handleChange}
                onFocus={() => setFocused("first_name")}
                onBlur={() => setFocused(null)}
                autoComplete="given-name"
                required
              />
            </div>
          </div>

          {/* Last Name */}
          <div className={fieldClass("last_name", form.last_name)}>
            <label htmlFor="last_name">Nom</label>
            <div className="register__input-wrap register__input-wrap--noicon">
              <input
                id="last_name"
                name="last_name"
                placeholder="Crusoe"
                value={form.last_name}
                onChange={handleChange}
                onFocus={() => setFocused("last_name")}
                onBlur={() => setFocused(null)}
                autoComplete="family-name"
                required
              />
            </div>
          </div>

          {/* Birth date */}
          <div className={fieldClass("birth_date", form.birth_date)}>
            <label htmlFor="birth_date">Date de naissance</label>
            <div className="register__input-wrap register__input-wrap--noicon">
              <input
                id="birth_date"
                type="date"
                name="birth_date"
                value={form.birth_date}
                onChange={handleChange}
                onFocus={() => setFocused("birth_date")}
                onBlur={() => setFocused(null)}
                autoComplete="bday"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className={fieldClass("email", form.email)}>
            <label htmlFor="email">Adresse e-mail</label>

            <div className="register__input-wrap">
              <span className="register__input-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
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
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className={fieldClass("password", form.password)}>
            <label htmlFor="password">Mot de passe</label>

            <div className="register__input-wrap register__input-wrap--eye">
              <span className="register__input-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              </span>

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
                required
              />

              <button
                type="button"
                className="register__eye"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Height */}
          <div className={fieldClass("height", form.height)}>
            <label htmlFor="height">Taille</label>
            <div className="register__input-wrap register__input-wrap--noicon">
                <input
                id="height"
                type="number"
                name="height"
                placeholder="165"
                value={form.height}
                onChange={handleChange}
                onFocus={() => setFocused("height")}
                onBlur={() => setFocused(null)}
                min="50"
                max="250"
                required
                />
            </div>
          </div>

          <button type="submit" className="register__submit">
            <span>S'inscrire</span>
          </button>
        </form>

        <p className="register__register">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}

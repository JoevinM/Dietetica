import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import "./AddNewsLetter.scss";

const BASE_URL = "http://localhost:3000";

export default function AddNewsletter({ onCreated }) {
  const { user } = useAuth();

  const [title,       setTitle]       = useState("");
  const [content,     setContent]     = useState("");
  const [submitting,  setSubmitting]  = useState(false);
  const [error,       setError]       = useState(null);
  const [success,     setSuccess]     = useState(false);
  const [newsletters, setNewsletters] = useState([]);
  const [loadingNl,   setLoadingNl]   = useState(false);

  const isFormValid = title.trim().length > 0 && content.trim().length > 0;

  // ── Load newsletters on mount ─────────────────────────────────────────────
  useEffect(() => {
    setLoadingNl(true);
    fetch(`${BASE_URL}/newsletters/dietician/${user.id}`, {
      credentials: "include",
    })
      .then(res => {
        if (!res.ok) throw new Error("Erreur chargement newsletters");
        return res.json();
      })
      .then(data => setNewsletters(data))
      .catch(err  => setError(err.message))
      .finally(()  => setLoadingNl(false));
  }, []);

  // ── Create newsletter ─────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    if (!isFormValid) return;

    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`${BASE_URL}/newsletters`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          dietician_id: user.id,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(err.message || "Erreur serveur");
      }

      const data = await res.json();
      setNewsletters(prev => [data, ...prev]);
      onCreated(data);
      setTitle("");
      setContent("");
      setSuccess(true);

    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  // ── Delete newsletter ─────────────────────────────────────────────────────
  async function handleDelete(newsletterId) {
    try {
      const res = await fetch(`${BASE_URL}/newsletters/${newsletterId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      setNewsletters(prev => prev.filter(n => n.id !== newsletterId));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="add-nl__wrapper">
      {/* Form */}
      <form className="add-nl" onSubmit={handleSubmit} noValidate>

      <h2 className="add-nl__title">Nouvelle newsletter</h2>

        {error   && <p className="add-nl__error">{error}</p>}
        {success && <p className="add-nl__success">Newsletter publiée avec succès !</p>}

        <div className="add-nl__field">
          <label htmlFor="nl-title">Titre</label>
          <input
            id="nl-title"
            type="text"
            placeholder="Titre de la newsletter"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="add-nl__field">
          <label htmlFor="nl-content">Contenu</label>
          <textarea
            id="nl-content"
            placeholder="Contenu de la newsletter"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
          />
        </div>

        <button
          type="submit"
          className="add-nl__submit"
          disabled={!isFormValid || submitting}
        >
          {submitting ? "Publication..." : "Publier"}
        </button>

      </form>

      {/* Newsletter list */}
      <div className="add-nl__list">
        <h3 className="add-nl__list-title">Newsletters publiées</h3>

        {loadingNl && <p className="add-nl__empty">Chargement…</p>}

        {!loadingNl && newsletters.length === 0 && (
          <p className="add-nl__empty">Aucune newsletter pour le moment.</p>
        )}

        {!loadingNl && newsletters.map(newsletter => (
          <div key={newsletter.id} className="add-nl__card">
            <span className="add-nl__card-title">{newsletter.title}</span>
            <button
              className="add-nl__card-delete"
              onClick={() => handleDelete(newsletter.id)}
              aria-label="Supprimer"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
              </svg>
              Supprimer
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}

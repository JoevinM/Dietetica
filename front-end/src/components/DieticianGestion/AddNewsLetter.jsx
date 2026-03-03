import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./AddNewsLetter.scss";

const BASE_URL = "http://localhost:3000";

/**
 * AddNewsletter — form component rendered directly inside the dashboard tab.
 * No modal, no redirect. Just title and content fields.
 * Uses httpOnly cookie via credentials: "include" (no manual token needed).
 *
 * Props:
 *  - onCreated : function called with the new newsletter object after success
 */
export default function AddNewsletter({ onCreated }) {
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const isFormValid = title.trim().length > 0 && content.trim().length > 0;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isFormValid) return;

    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`${BASE_URL}/newsletters`, {
        method: "POST",
        credentials: "include", // sends httpOnly cookie automatically
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

  return (
    <form className="add-nl" onSubmit={handleSubmit} noValidate>

      <h2 className="add-nl__title">Nouvelle newsletter</h2>

      {error && <p className="add-nl__error">{error}</p>}
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
  );
}

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "/src/components/NewLetterDetail.scss";

export default function NewsletterDetail() {
  const { id } = useParams();
  const [newsletter, setNewsletter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/newsletters/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Newsletter introuvable");
        return res.json();
      })
      .then((data) => setNewsletter(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric", month: "long", year: "numeric",
    });

  const getInitials = (d) =>
    d ? `${d.first_name?.[0] ?? ""}${d.last_name?.[0] ?? ""}`.toUpperCase() : "?";

  const getFullName = (d) =>
    d ? `${d.first_name} ${d.last_name}` : "Diététicien";

  if (loading) return <div className="nld-state"><div className="nld-spinner" /><p>Chargement…</p></div>;
  if (error)   return <div className="nld-state nld-state--error"><p>{error}</p><Link to="/newsletters" className="nld-back">← Retour</Link></div>;

  return (
    <article className="nld">
      <div className="nld__inner">

        <Link to="/newsletters" className="nld__back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Toutes les newsletters
        </Link>

        <header className="nld__header">
          <div className="nld__author">
            <div className="nld__avatar">{getInitials(newsletter.dietician)}</div>
            <div>
              <span className="nld__author-name">{getFullName(newsletter.dietician)}</span>
              <span className="nld__date">{formatDate(newsletter.created_at)}</span>
            </div>
          </div>
          <h1 className="nld__title">{newsletter.title}</h1>
        </header>

        <div className="nld__divider" />

        <div className="nld__content">
          {newsletter.content.split("\n").map((para, i) =>
            para.trim() ? <p key={i}>{para}</p> : null
          )}
        </div>

      </div>
    </article>
  );
}

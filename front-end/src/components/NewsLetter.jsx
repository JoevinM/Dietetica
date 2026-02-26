import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "/src/components/NewsLetter.scss";

export default function Newsletters() {
  const [newsletters, setNewsletters] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/newsletters")
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement");
        return res.json();
      })
      .then((data) => setNewsletters(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = newsletters.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric", month: "long", year: "numeric",
    });

  return (
    <>
      {/* Hero */}

      <section className="nl-hero">
        <div className="nl-hero__inner">
          <div className="nl-hero__eyebrow">Nos publications</div>
          <h1>Conseils &amp; <em>Actualités</em><br />nutrition</h1>
        </div>
      </section>

      {/* Filters */}

      <div className="nl-filters">
        <p className="nl-filters__count">
          <strong>{filtered.length}</strong> Article{filtered.length !== 1 ? "s" : ""} disponible{filtered.length !== 1 ? "s" : ""}
        </p>
        <div className="nl-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Rechercher un article…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}

      <div className="nl-grid">
        {loading && (
          <div className="nl-state">
            <div className="nl-spinner" />
            <p>Chargement…</p>
          </div>
        )}

        {error && (
          <div className="nl-state nl-state--error">
            <p>Une erreur est survenue : {error}</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="nl-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
            <p>Aucune newsletter trouvée.</p>
          </div>
        )}

        {!loading && !error && filtered.map((newsletter, index) => (
          <article
            className={`nl-card ${index === 0 && !search ? "nl-card--featured" : ""}`}
            key={newsletter.id}
          >
            {index === 0 && !search && (
              <div className="nl-card__visual">
                <div className="nl-card__visual-icon">
                  <svg viewBox="0 0 64 64" fill="none">
                    <path d="M32 8C32 8 16 20 16 36a16 16 0 0032 0c0-16-16-28-16-28z" fill="white"/>
                    <path d="M32 24C32 24 22 32 22 42a10 10 0 0020 0c0-10-10-18-10-18z" fill="#52B788" opacity=".8"/>
                  </svg>
                </div>
              </div>
            )}

            <div className="nl-card__body">
              <div className="nl-card__meta">
                <span className="nl-card__date">{formatDate(newsletter.created_at)}</span>
              </div>

              {index === 0 && !search && (
                <span className="nl-card__badge nl-card__badge--featured">À la une</span>
              )}

              <h2 className="nl-card__title">{newsletter.title}</h2>
              <p className="nl-card__excerpt">{newsletter.content}</p>
              <Link to={`/newsletter/${newsletter.id}`} className="nl-card__read">
                Lire
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

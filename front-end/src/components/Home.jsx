import { useEffect, useState } from "react";
import "./Home.scss";

const BASE_URL = "http://localhost:3000";

// ── Données statiques de la vitrine ──────────────────────────────────────────

const ACTIVITIES = [
  { label: "Rééquilibrage alimentaire" },
  { label: "Nutrition du sportif" },
  { label: "Nutrition pédiatrique" },
  { label: "Troubles du comportement alimentaire" },
];

const INFOS = {
  approach: `Mon approche est centrée sur la personne et non sur le régime. 
  Je pratique une diététique thérapeutique bienveillante, en tenant compte 
  de vos habitudes, de votre histoire et de vos objectifs. Ma spécialisation 
  porte sur la nutrition clinique et les troubles digestifs.`,

  cabinet: {
    hasFixedCabinet: true,
    address: "12 rue de la Santé, 75014 Paris",
    schedule: "Lundi au vendredi, 9h–18h",
  },

  consultations: [
    "Consultation en cabinet (présentiel)",
    "Consultation en téléconsultation (visio)",
    "Suivi par messagerie sécurisée",
  ],

  reimbursements: [
    "Non remboursé par la Sécurité Sociale",
    "Prise en charge possible par certaines mutuelles (se renseigner auprès de votre organisme)",
    "Possibilité de facturer sur devis pour les entreprises",
  ],

  pricing: [
    { label: "Première consultation (1h)", price: "60 €" },
    { label: "Consultation de suivi (45 min)", price: "45 €" },
    { label: "Téléconsultation", price: "40 €" },
    { label: "Bilan nutritionnel complet", price: "80 €" },
  ],
};

// ── Composant principal ───────────────────────────────────────────────────────

export default function Home() {
  const [latestArticle, setLatestArticle] = useState(null);
  const [loadingArticle, setLoadingArticle] = useState(true);

  // Récupère uniquement le dernier article publié
  useEffect(() => {
    fetch(`${BASE_URL}/newsletters`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        if (data.length > 0) {
          const sorted = [...data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          setLatestArticle(sorted[0]);
        }
      })
      .catch(() => setLatestArticle(null))
      .finally(() => setLoadingArticle(false));
  }, []);

  return (
  <div className="home">

    {/* ── Hero ── */}
    <section className="home__hero">
      <h1 className="home__hero-title">Bienvenue sur Dietetica</h1>
      <p className="home__hero-subtitle">
        Votre espace santé personnalisé, en lien direct avec votre diététicien.
      </p>
      <a href="/register" className="home__hero-cta">Prendre rendez-vous</a>
    </section>

    <div className="home__cards">

      {/* Card 1 → droite, fond pale */}
      <div className="home__card">
        <h2 className="home__card-title">Mes spécialisations</h2>
        <div className="home__activities">
          {ACTIVITIES.map((activity, i) => (
            <div key={i} className="home__activity-item">
              <span>{activity.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Card 2 → gauche, fond beige */}
      <div className="home__card">
        <h2 className="home__card-title">Mon approche thérapeutique</h2>
        <p className="home__card-text">{INFOS.approach}</p>
      </div>

      {/* Card 3 → droite, fond pale */}
      {INFOS.cabinet.hasFixedCabinet && (
        <div className="home__card">
          <h2 className="home__card-title">Mon cabinet</h2>
          <div className="home__cabinet">
            <p>{INFOS.cabinet.address}</p>
            <p>{INFOS.cabinet.schedule}</p>
          </div>
        </div>
      )}

      {/* Card 4 → gauche, fond beige */}
      <div className="home__card">
        <h2 className="home__card-title">Modalités de consultation</h2>
        <ul className="home__list">
          {INFOS.consultations.map((item, i) => (
            <li key={i} className="home__list-item">{item}</li>
          ))}
        </ul>
      </div>

      {/* Card 5 → droite, fond pale */}
      <div className="home__card">
        <h2 className="home__card-title">Modalités de remboursement</h2>
        <ul className="home__list">
          {INFOS.reimbursements.map((item, i) => (
            <li key={i} className="home__list-item">{item}</li>
          ))}
        </ul>
      </div>

      {/* Card 6 → gauche, fond beige */}
      <div className="home__card">
        <h2 className="home__card-title">Tarifs</h2>
        <div className="home__pricing">
          {INFOS.pricing.map((item, i) => (
            <div key={i} className="home__pricing-row">
              <span className="home__pricing-label">{item.label}</span>
              <span className="home__pricing-price">{item.price}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Card 7 → droite, fond pale */}
      <div className="home__card">
        <h2 className="home__card-title">Dernier article</h2>
        {loadingArticle ? (
          <p className="home__empty">Chargement…</p>
        ) : latestArticle ? (
          <>
            <h3 className="home__article-title">{latestArticle.title}</h3>
            <p className="home__article-date">
              {new Date(latestArticle.created_at).toLocaleDateString("fr-FR", {
                day: "numeric", month: "long", year: "numeric"
              })}
            </p>
            <p className="home__article-excerpt">
              {latestArticle.content.length > 200
                ? latestArticle.content.slice(0, 200) + "…"
                : latestArticle.content}
            </p>
          </>
        ) : (
          <p className="home__empty">Aucun article publié pour le moment.</p>
        )}
      </div>

    </div>
  </div>
);
}

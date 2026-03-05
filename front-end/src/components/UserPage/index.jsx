import { useState, useEffect } from "react";
import { getEntriesByUser, createEntry, deleteEntry, getUser } from "../../api/userService";
import WeightChart from "./WeightChart";
import EntryForm   from "./EntryForm";
import "./UserPage.scss";

function computeImc(weight, height) {
  return (weight / (height / 100) ** 2).toFixed(1);
}

export default function UserPage({ user }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState(null);
  const [userData, setUserData] = useState(null);

  // ── Chargement initial ────────────────────────────────────────────────────
  useEffect(() => {
    if (!user?.id) return;
    getEntriesByUser(user.id)
      .then(data  => setEntries(data))
      .catch(err  => setError(err.message))
      .finally(()  => setLoading(false));
    // Charger le profil de l'utilisateur
    getUser(user.id)
    .then(setUserData)
    .catch(err => setError(err.message));
  }, [user?.id]);

  // ── Créer une entrée ──────────────────────────────────────────────────────
  async function handleCreate(payload) {
    setSaving(true);
    setError(null);
    try {
      const newEntry = await createEntry(payload);
      setEntries(prev => [newEntry, ...prev]);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // ── Supprimer une entrée ──────────────────────────────────────────────────
  async function handleDelete(entryId) {
    try {
      await deleteEntry(entryId);
      setEntries(prev => prev.filter(e => e.id !== entryId));
    } catch (err) {
      setError(err.message);
    }
  }

  // ── Données dérivées ──────────────────────────────────────────────────────
  const latestWeight = entries.find(e => e.weight)?.weight ?? null;
  const imc =
    latestWeight && userData?.height
      ? computeImc(latestWeight, userData.height)
      : null; 

  const chartData = [...entries]
    .filter(e => e.weight)
    .reverse()
    .map(e => ({
      value: e.weight,
      date:  new Date(e.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
    }));

  // ── Rendu ─────────────────────────────────────────────────────────────────
  if (loading) return <p className="up__empty" style={{ padding: "2rem" }}>Chargement…</p>;

  return (
    <div className="up">

      {/* En-tête */}
      <header className="up__header">
        <div className="up__avatar">{user.name.split(" ").map(n => n[0]).join("")}</div>
        <div>
          <h1 className="up__name">{user.name}</h1>
          <p className="up__email">{user.email}</p>
        </div>
      </header>

      {/* Infos */}
      <section className="up__section">
        <h2 className="up__section-title">Informations</h2>
        <div className="up__stats">
          {user.age    && <div className="up__stat"><span className="up__stat-label">Âge</span>   <span className="up__stat-value">{user.age} <small>ans</small></span></div>}
          {user.height && <div className="up__stat"><span className="up__stat-label">Taille</span><span className="up__stat-value">{user.height} <small>cm</small></span></div>}
          <div className="up__stat">
            <span className="up__stat-label">Poids actuel</span>
            <span className="up__stat-value">{latestWeight ?? "—"} <small>kg</small></span>
          </div>
          <div className="up__stat up__stat--imc">
            <span className="up__stat-label">IMC</span>
            <span className="up__stat-value">{imc ?? "—"}</span>
          </div>
        </div>
      </section>

      <hr className="up__divider" />
      {error && <p className="up__error">{error}</p>}

      {/* Formulaire */}
      <section className="up__section">
        <h2 className="up__section-title">Ajouter une entrée</h2>
        <p className="up__hint">Remplissez les champs que vous souhaitez enregistrer pour aujourd'hui.</p>
        <EntryForm onSubmit={handleCreate} saving={saving} />
      </section>

      <hr className="up__divider" />

      {/* Graphique */}
      <section className="up__section">
        <h2 className="up__section-title">Évolution du poids</h2>
        <WeightChart data={chartData} />
      </section>

      <hr className="up__divider" />

      {/* Historique */}
      <section className="up__section">
        <h2 className="up__section-title">Historique</h2>
        {entries.length === 0 ? (
          <p className="up__empty">Aucune entrée enregistrée pour l'instant.</p>
        ) : (
          <table className="up__table">
            <thead>
              <tr><th>Date</th><th>Poids</th><th>IMC</th><th>Exercice</th><th>Calories</th><th>Notes</th><th></th></tr>
            </thead>
            <tbody>
              {entries.map(entry => {
                const entryImc = entry.weight && user?.height
                  ? computeImc(entry.weight, user.height)
                  : "—";
                return (
                  <tr key={entry.id}>
                    <td>{new Date(entry.date).toLocaleDateString("fr-FR")}</td>
                    <td>{entry.weight   ? `${entry.weight} kg`     : "—"}</td>
                    <td>{entryImc}</td>
                    <td>{entry.activity || "—"}</td>
                    <td>{entry.calories ? `${entry.calories} kcal` : "—"}</td>
                    <td className="up__td-notes" title ={entry.notes || ""}>{entry.notes || "—"}</td>
                    <td>
                      <button className="up__btn-delete" onClick={() => handleDelete(entry.id)} aria-label="Supprimer">×</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

    </div>
  );
}

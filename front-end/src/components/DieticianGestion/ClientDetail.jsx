import WeightChart from "../UserPage/WeightChart";

function computeImc(weight, height) {
  return (weight / (height / 100) ** 2).toFixed(1);
}

function imcLabel(imc) {
  if (imc < 18.5) return "Insuffisant";
  if (imc < 25)   return "Normal";
  if (imc < 30)   return "Surpoids";
  return "Obésité";
}

export default function ClientDetail({ client, entries, loading }) {
  if (loading) return <p className="dd__empty">Chargement des données…</p>;

  const latestWeight = entries.find(e => e.weight)?.weight ?? null;
  const imc = latestWeight && client?.height
    ? computeImc(latestWeight, client.height)
    : null;

  const chartData = [...entries]
    .filter(e => e.weight)
    .reverse()
    .map(e => ({
      value: e.weight,
      date:  new Date(e.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
    }));

  return (
    <div className="dd__detail">

      {/* En-tête client */}
      <div className="dd__detail-header">
        <div className="dd__avatar-lg">
          {client.first_name?.[0]}{client.last_name?.[0]}
        </div>
        <div>
          <h2 className="dd__detail-name">{client.name}</h2>
          <p className="dd__detail-email">{client.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="dd__stats">
        {client.age    && <div className="dd__stat"><span className="dd__stat-label">Âge</span>         <span className="dd__stat-value">{client.age} <small>ans</small></span></div>}
        {client.height && <div className="dd__stat"><span className="dd__stat-label">Taille</span>      <span className="dd__stat-value">{client.height} <small>cm</small></span></div>}
        <div className="dd__stat">
          <span className="dd__stat-label">Poids actuel</span>
          <span className="dd__stat-value">{latestWeight ?? "—"} <small>kg</small></span>
        </div>
        <div className="dd__stat dd__stat--imc">
          <span className="dd__stat-label">IMC</span>
          <span className="dd__stat-value">{imc ?? "—"} <small>{imc ? imcLabel(imc) : ""}</small></span>
        </div>
      </div>

      {/* Graphique */}
      <h3 className="dd__sub-title">Évolution du poids</h3>
      <WeightChart data={chartData} />

      {/* Historique */}
      <h3 className="dd__sub-title">Historique des entrées</h3>
      {entries.length === 0 ? (
        <p className="dd__empty">Aucune entrée enregistrée pour ce client.</p>
      ) : (
        <table className="dd__table">
          <thead>
            <tr><th>Date</th><th>Poids</th><th>IMC</th><th>Exercice</th><th>Calories</th><th>Notes</th></tr>
          </thead>
          <tbody>
            {entries.map(entry => {
              const entryImc = entry.weight && client?.height
                ? computeImc(entry.weight, client.height)
                : "—";
              return (
                <tr key={entry.id}>
                  <td>{new Date(entry.date).toLocaleDateString("fr-FR")}</td>
                  <td>{entry.weight   ? `${entry.weight} kg`     : "—"}</td>
                  <td>{entryImc}</td>
                  <td>{entry.activity || "—"}</td>
                  <td>{entry.calories ? `${entry.calories} kcal` : "—"}</td>
                  <td className="dd__td-notes">{entry.notes || "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

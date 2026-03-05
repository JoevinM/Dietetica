import { useState, useEffect } from "react";
import { getAllUsers, getEntriesByUser } from "../../api/dietService";
import ClientSearch from "./ClientSearch";
import ClientDetail from "./ClientDetail";
import { useAuth } from "../../context/AuthContext";
import "./DieticianGestion.scss";
import AddNewsLetter from "./AddNewsLetter.jsx";

const TABS = [
  { id: "clients",    label: "Mes clients"  },
  { id: "articles", label: "Articles"   },
];

export default function DieticianGestion() {
  const { user: diet } = useAuth();

  const [activeTab,     setActiveTab]     = useState("clients");
  const [users,         setUsers]         = useState([]);
  const [search,        setSearch]        = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [entries,       setEntries]       = useState([]);
  const [loadingUsers,  setLoadingUsers]  = useState(true);
  const [loadingEntries, setLoadingEntries] = useState(false);
  const [error,         setError]         = useState(null);

  // ── Chargement de tous les clients ───────────────────────────────────────
  useEffect(() => {
  getAllUsers()
    .then(data => setUsers(data))
    .catch(err  => setError(err.message))
    .finally(()  => setLoadingUsers(false));
}, []);

  // ── Sélection d'un client → charge ses entrées ───────────────────────────
  async function handleSelectClient(client) {
    setSelectedClient(client);
    setEntries([]);
    setLoadingEntries(true);
    try {
      const data = await getEntriesByUser(client.id);
      setEntries(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingEntries(false);
    }
  }

  // ── Filtrage par nom ──────────────────────────────────────────────────────
  const filteredUsers = users.filter(u => {
  const fullName = `${u.first_name} ${u.last_name}`.toLowerCase();
  return fullName.includes(search.toLowerCase());
});

  // ── Rendu ─────────────────────────────────────────────────────────────────
  return (
    <div className="dd">

      {/* En-tête */}
      <header className="dd__header">
        <div className="dd__avatar">{diet.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
        <div>
          <h1 className="dd__name">{diet.name}</h1>
          <p className="dd__role">Diététicien</p>
        </div>
      </header>

      {/* Onglets */}
      <div className="dd__tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`dd__tab ${activeTab === tab.id ? "dd__tab--active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && <p className="dd__error">{error}</p>}

      {/* ── Onglet Clients ── */}
      {activeTab === "clients" && (
        <div className="dd__clients-layout">

          {/* Colonne gauche : recherche + liste */}
          <div className="dd__clients-panel">
            <input
              className="dd__search"
              type="text"
              placeholder="Rechercher un client…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {loadingUsers ? (
              <p className="dd__empty">Chargement…</p>
            ) : (
              <ClientSearch
                users={filteredUsers}
                onSelect={handleSelectClient}
                selectedId={selectedClient?.id}
              />
            )}
          </div>

          {/* Colonne droite : détail client */}
          <div className="dd__detail-panel">
            {selectedClient ? (
              <ClientDetail
                client={selectedClient}
                entries={entries}
                loading={loadingEntries}
              />
            ) : (
              <div className="dd__placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                <p>Sélectionnez un client pour afficher ses informations</p>
              </div>
            )}
          </div>

        </div>
      )}

		{/* ── Onglet Entretiens ── */}
		{activeTab === "articles" && (
		<AddNewsLetter onCreated={(newNewsletter) => newNewsletter} />
	)}

    </div>
  );
}

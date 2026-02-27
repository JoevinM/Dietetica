// Reçoit users = liste complète, onSelect = callback quand on clique sur un client
export default function ClientSearch({ users, onSelect, selectedId }) {
  return (
    <div className="dd__search-list">
      {users.length === 0 && (
        <p className="dd__empty">Aucun client trouvé.</p>
      )}
      {users.map(u => (
        <button
          key={u.id}
          className={`dd__client-row ${selectedId === u.id ? "dd__client-row--active" : ""}`}
          onClick={() => onSelect(u)}
        >
          <div className="dd__client-avatar">
            {u.first_name?.[0]}{u.last_name?.[0]}
          </div>
          <div className="dd__client-info">
            <span className="dd__client-name">{u.name}</span>
            <span className="dd__client-email">{u.email}</span>
          </div>
          <svg className="dd__client-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      ))}
    </div>
  );
}

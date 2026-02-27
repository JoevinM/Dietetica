import { useEffect, useState } from "react";

export default function Home() {
  const [names, setNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleClick() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("http://localhost:3000/users");

      if (!res.ok) {
        throw new Error("Erreur serveur");
      }

      const data = await res.json();
      setNames(data);

    } catch (err) {
      console.error(err);
      setError("Impossible de charger les utilisateurs.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <button onClick={handleClick}>
        Charger les utilisateurs
      </button>

      {loading && <p>Chargement...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {names.map(user => (
          <li key={user.id}>
            Prénom : {user.first_name}
          </li>
        ))}
      </ul>
    </div>
  );
}
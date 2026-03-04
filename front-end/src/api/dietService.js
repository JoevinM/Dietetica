// src/api/dietService.js

const BASE_URL = "http://localhost:3000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || "Erreur serveur");
  }

  if (res.status === 204) return null;
  return res.json();
}

// Récupère tous les utilisateurs (dieticianOnly)
export function getAllUsers() {
  return request("/users");
}

// Récupère les entrées d'un utilisateur spécifique
export function getEntriesByUser(userId) {
  return request(`/daily/user/${userId}`);
}

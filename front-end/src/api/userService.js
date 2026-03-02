// src/api/userService.js
// Toutes les requêtes vers le back-end (sessions/cookies, pas besoin de token manuel)

const BASE_URL = "http://localhost:3000";

// ─── Utilitaire fetch ─────────────────────────────────────────────────────────
async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: "include", // envoie le cookie de session automatiquement
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || "Erreur serveur");
  }

  // 204 No Content (DELETE) → pas de body
  if (res.status === 204) return null;

  return res.json();
}

// ─── Utilisateur ──────────────────────────────────────────────────────────────

// Récupère les infos d'un utilisateur par son id
export function getUser(userId) {
  return request(`/users/${userId}`);
}

// Met à jour les infos d'un utilisateur (nom, email, âge, taille…)
export function updateUser(userId, data) {
  return request(`/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// ─── Daily Entries ────────────────────────────────────────────────────────────

// Récupère toutes les entrées d'un utilisateur
// Retourne un tableau de DailyEntry triés par date décroissante
export function getEntriesByUser(userId) {
  return request(`/daily/user/${userId}`);
}

// Crée une nouvelle entrée pour aujourd'hui
// data = { date, weight?, calories?, activity?, notes? }
export function createEntry(data) {
  return request("/daily", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Supprime une entrée par son id
export function deleteEntry(entryId) {
  return request(`/daily/${entryId}`, {
    method: "DELETE",
  });
}

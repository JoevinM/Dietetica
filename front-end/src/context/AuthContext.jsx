import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // appel backend pour récupérer l'utilisateur via cookie
    api.get("/auth/me")
      .then(res => setUser(res.data.user)) // si cookie ok, setUser
      .catch(() => setUser(null)) // sinon, user = null
      .finally(() => setLoading(false)); // on arrête le loading
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    setUser(res.data.user); // le back envoie { user } seulement
  };
  const register = async (formData) => {
    const res = await api.post("/users", formData);
    setUser(res.data.user);
    };

  const logout = async () => {
    await api.post("/auth/logout", {});
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

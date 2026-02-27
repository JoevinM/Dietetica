import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Route accessible uniquement aux utilisateurs classiques
export function UserRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // attend que l'auth soit vérifiée
  }
  
  if (!user)
    return <Navigate to="/login"   replace />;
  if (user.role !== "user") return <Navigate to="/dashboard" replace />;
    return children;
}

// Route accessible uniquement aux diététiciens
export function DietRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // attend que l'auth soit vérifiée
  }
  
  if (!user)
    return <Navigate to="/login" replace />;
  if (user.role !== "dietician" && user.role !=="admin") return <Navigate to="/profil" replace />;
  return children;
}

// Route générique
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // attend que l'auth soit vérifiée
  }

  return user ? children : <Navigate to="/login" replace />;
}

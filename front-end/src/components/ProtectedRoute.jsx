import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // attend que l'auth soit vérifiée
  }

  return user ? children : <Navigate to="/login" replace />;
}

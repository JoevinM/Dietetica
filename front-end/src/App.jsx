import { Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute, { UserRoute, DietRoute } from "./components/ProtectedRoute";
import Home from "./components/Home";
import Login from "./components/Login";
import Header from "./components/Header";
import Footer from "./components/Footer";
import UserPage from "./components/UserPage/index";
import DietDashboard from "./components/DietDashboard/index";
import NewLetter from "./components/NewLetter";
import NewLetterDetail from "./components/NewLetterDetail";

// Appelle toutes les routes
function AppRoutes() {
  const { user } = useAuth();

  return (  
    <>
      <Header />
      <Routes>
        <Route path="/login"           element={<Login />} />
        <Route path="/"                element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/profil"          element={<UserRoute><UserPage user={user} /></UserRoute>} />
        <Route path="/dashboard"       element={<DietRoute><DietDashboard /></DietRoute>} />
        <Route path="/newletter"       element={<NewLetter />} />
        <Route path="/newletter/:id"   element={<NewLetterDetail />} />
      </Routes>
      <Footer />
    </>
  );
}

// App ne fait qu'envelopper avec le Provider
export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
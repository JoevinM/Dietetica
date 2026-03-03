import { Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute, { UserRoute, DietRoute } from "./components/ProtectedRoute";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Google from "./components/google";
import NewsLetter from "./components/NewsLetter";
import NewsLetterDetail from "./components/NewsLetterDetail";
import UserPage from "./components/UserPage/index";
import DieticianGestion from "./components/DieticianGestion/index";

// Appelle toutes les routes
function AppRoutes() {
  const { user } = useAuth();

  return (
    <>
    <div className="app-layout">
      <Header />
        <div className="app-content">
          <Routes>
            <Route path="/login"            element={<Login />} />
            <Route path="/register"         element={<Register />} />
            <Route path="/"                 element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/profil"           element={<UserRoute><UserPage user={user} /></UserRoute>} />
            <Route path="/gestion"          element={<DietRoute><DieticianGestion /></DietRoute>} />
            <Route path="/google"           element={<ProtectedRoute><Google /></ProtectedRoute>} />
            <Route path="/newsletter"       element={<NewsLetter />} />
            <Route path="/newsletter/:id"   element={<NewsLetterDetail />} />
          </Routes>
        </div>
      <Footer />
    </div>
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

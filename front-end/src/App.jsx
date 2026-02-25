import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./Home";
import Login from "./Login";
import Header from "./components/Header";
<<<<<<< HEAD
import Footer from "./components/Footer"
import google from "./components/googles/google"

function Home() {
  return <h1>Accueil</h1>
}
=======
import Footer from "./components/Footer";
>>>>>>> origin/production

function App() {
  return (
    <AuthProvider>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
<<<<<<< HEAD
		<Route path="/google" element={<google />} />
=======
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
>>>>>>> origin/production
      </Routes>
      <Footer />
    </AuthProvider>
  );
}

export default App;

import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./Home";
import Login from "./Login";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NewLetter from "./components/NewLetter";
import NewLetterDetail from "./components/NewLetterDetail";

function App() {
  return (
    <AuthProvider>
      <div className="app-layout">
        <Header />

        <div className="app-content">
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            <Route path="/newletter" element={<NewLetter />} />
            <Route path="/newletter/:id" element={<NewLetterDetail />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;

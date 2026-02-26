import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Header from "./components/Header";
import Footer from "./components/Footer"

function Home() {
  return <h1>Accueil</h1>
}
function App() {
  return (
    <div className="app-layout">
    <Header />

    <div className="app-content">
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        </Routes>
    </div>

    <Footer />
    </div>
  );
}

export default App;

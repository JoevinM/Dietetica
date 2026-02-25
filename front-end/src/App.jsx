import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Header from "./components/Header";
import Footer from "./components/Footer"
import google from "./components/googles/google"

function Home() {
  return <h1>Accueil</h1>
}

function App() {
  return (
    <>
      <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
		<Route path="/google" element={<google />} />
      </Routes>
      <Footer/>
    </>
  );
}

export default App;

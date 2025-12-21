import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Routes>
      {/* "/" adresine gidilince HomePage açılsın */}
      <Route path="/" element={<HomePage />} />

      {/* "/login" adresine gidilince LoginPage açılsın */}
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;

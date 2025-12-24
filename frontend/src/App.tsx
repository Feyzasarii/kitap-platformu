import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage"; // 👈 1. YENİ: Buraya import ettik
import HomePage from "./pages/HomePage";
import BookDetailPage from "./pages/BookDetailPage";
import AdminDashboard from "./pages/AdminDashboard";
import PrivateRoute from "./PrivateRoute";

function App() {
  return (
    <Routes>
      {/* 🔓 HERKESE AÇIK (PUBLIC) ROTALAR */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />{" "}
      {/* 👈 2. YENİ: Kayıt rotası eklendi */}
      {/* 🔒 SADECE ADMİNLERİN GİRECEĞİ YERLER */}
      <Route element={<PrivateRoute restrictTo="admin" />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
      {/* 👤 SADECE KULLANICILARIN (USER) GİRECEĞİ YERLER */}
      <Route element={<PrivateRoute restrictTo="user" />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/book/:id" element={<BookDetailPage />} />
      </Route>
      {/* Bilinmeyen bir adrese giderse Login'e at */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;

import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import BookDetailPage from "./pages/BookDetailPage";
import AdminDashboard from "./pages/AdminDashboard";
import ProfilePage from "./pages/ProfilePage"; // 👈 1. Profil sayfasını import ettik
import PrivateRoute from "./PrivateRoute";

function App() {
  return (
    <Routes>
      {/* 🔓 HERKESE AÇIK (PUBLIC) ROTALAR */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* 🔒 SADECE ADMİNLER (Admin Paneli) */}
      <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      {/* 👤 SADECE KULLANICILAR (Kullanıcı Ana Sayfası) */}
      <Route element={<PrivateRoute allowedRoles={["user"]} />}>
        <Route path="/" element={<HomePage />} />
      </Route>

      {/* 🤝 ORTAK ALAN: Hem Admin hem User erişebilir */}
      <Route element={<PrivateRoute allowedRoles={["user", "admin"]} />}>
        <Route path="/book/:id" element={<BookDetailPage />} />
        {/* 👈 2. Profil rotasını ortak alana ekledik, çünkü adminin de bir profili var */}
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* 🚫 404 & YÖNLENDİRME */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;

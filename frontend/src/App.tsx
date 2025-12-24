import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import BookDetailPage from "./pages/BookDetailPage";
import AdminDashboard from "./pages/AdminDashboard";
import PrivateRoute from "./PrivateRoute";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* 🔒 SADECE ADMİNLERİN GİRECEĞİ YERLER */}
      <Route element={<PrivateRoute restrictTo="admin" />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      {/* 👤 SADECE KULLANICILARIN (USER) GİRECEĞİ YERLER */}
      {/* Admin buraya girmeye çalışırsa PrivateRoute onu /admin'e atacak */}
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

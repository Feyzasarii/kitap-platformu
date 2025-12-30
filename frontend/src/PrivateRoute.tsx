import { Navigate, Outlet } from "react-router-dom";

// restrictTo yerine allowedRoles (dizi) kullanarak daha esnek bir yapı kuruyoruz
const PrivateRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role")?.toLowerCase();

  // 1. Giriş yapılmamışsa kapıdan çevir
  if (!token) return <Navigate to="/login" replace />;

  // 2. Rol listede yoksa (Örn: Admin, User sayfasına girmeye çalışırsa) yönlendir
  if (!allowedRoles.includes(role || "")) {
    return <Navigate to={role === "admin" ? "/admin" : "/"} replace />;
  }

  // 3. Her şey yolundaysa alt sayfayı (Outlet) göster
  return <Outlet />;
};

export default PrivateRoute;

import { Navigate, Outlet } from "react-router-dom";

// Bu bileşen artık "restrictTo" (Kısıtla) diye bir özellik alabiliyor
interface PrivateRouteProps {
  restrictTo?: "admin" | "user"; // Sadece admin mi girsin, sadece user mı?
}

const PrivateRoute = ({ restrictTo }: PrivateRouteProps) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // Rolü alıyoruz

  // 1. HİÇ TOKEN YOKSA -> DİREKT LOGİN'E
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. EĞER BU ROTA SADECE ADMIN İÇİNSE VE SEN ADMIN DEĞİLSEN
  if (restrictTo === "admin" && role !== "admin") {
    // Seni kendi çöplüğüne (User Ana Sayfasına) gönderiyoruz
    return <Navigate to="/" replace />;
  }

  // 3. EĞER BU ROTA SADECE USER İÇİNSE VE SEN ADMIN İSEN
  // (Adminlerin user sayfasına girmesini engellemek için)
  if (restrictTo === "user" && role === "admin") {
    // Seni kendi sarayına (Admin Paneline) gönderiyoruz
    return <Navigate to="/admin" replace />;
  }

  // 4. HER ŞEY YOLUNDAYSA İÇERİ GİR
  return <Outlet />;
};

export default PrivateRoute;

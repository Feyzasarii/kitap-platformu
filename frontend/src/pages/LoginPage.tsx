import { useState, useEffect } from "react"; // useEffect'i ekledik
import api from "../api/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom"; // useNavigate importu

const LoginPage = () => {
  // 🟢 DÜZELTME BURADA: Hook'lar fonksiyonun EN BAŞINDA ve İÇİNDE olmalı
  const navigate = useNavigate();

  // Eğer zaten giriş yapmışsa, Login ekranını hiç gösterme, Ana Sayfaya at
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/", { replace: true });
    }
  }, []);

  // State tanımları
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", { identifier, password });

      // 👇 HATA BURADAYDI. DÜZELTİLMİŞ HALİ:
      // Backend veriyi 'user' objesi içinde gönderdiği için biz de oradan almalıyız.
      const role = response.data.user.role;

      // Kontrol için konsola yazdıralım (Büyük/Küçük harf farkı olabilir: 'Admin' mi 'admin' mi?)
      console.log("Gelen Rol:", role);

      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("role", role);

      toast.success("Giriş Başarılı! 🚀");

      setTimeout(() => {
        // 👇 BURAYA DİKKAT: Backend'den "Admin" (büyük harfle) geliyor olabilir.
        // Garanti olsun diye hepsini küçük harfe çevirip kontrol edelim.
        if (role.toLowerCase() === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }, 1000);
    } catch (error: any) {
      console.error("Giriş Hatası:", error);
      toast.error("Giriş Başarısız! Kullanıcı adı veya şifre yanlış.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      <nav className="w-full p-6 border-b border-gray-800">
        <h1 className="text-3xl font-bold text-blue-500 tracking-wide">
          📚 Kitap Yorum Platformu
        </h1>
      </nav>

      <div className="flex-1 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
          <h2 className="text-2xl font-bold text-center mb-6 text-white">
            Hesabına Giriş Yap
          </h2>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Kullanıcı Adı veya E-posta
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                placeholder="Örn: kullanici_ad"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Şifre
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition duration-200 shadow-lg transform hover:scale-[1.02]"
            >
              Giriş Yap
            </button>
          </form>

          <p className="text-center text-gray-400 mt-4 text-sm">
            Hesabın yok mu?{" "}
            <Link to="/register" className="text-blue-400 hover:underline">
              Kayıt Ol
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

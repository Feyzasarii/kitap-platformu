import { useState } from "react";
import api from "../api/axios"; // 👈 Az önce oluşturduğumuz ayar dosyası
import { toast, ToastContainer } from "react-toastify"; // Bildirimler için
import "react-toastify/dist/ReactToastify.css"; // CSS dosyası
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 1. Backend'e istek at
      const response = await api.post("/auth/login", {
        identifier: identifier,
        password: password,
      });

      // 2. Başarılıysa Token'ı al
      console.log("Gelen Cevap:", response.data);
      localStorage.setItem("token", response.data.access_token); // Token'ı tarayıcıya kaydet

      // 3. Kullanıcıya haber ver
      toast.success("Giriş Başarılı! Hoşgeldin şampiyon. 🚀");
      // ... önceki kodlar
      toast.success("Giriş Başarılı! Hoşgeldin şampiyon. 🚀");

      // 👇 YÖNLENDİRME KODU
      setTimeout(() => {
        navigate("/");
      }, 1000); // 1 saniye bekleyip yönlendirsin (bildirim görünsün diye)

      // (İleride burada yönlendirme yapacağız)
    } catch (error: any) {
      // 4. Hata varsa göster
      console.error("Giriş Hatası:", error);
      toast.error("Giriş Başarısız! Kullanıcı adı veya şifre yanlış.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      {/* Bildirim Baloncuğu Kutusu */}
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
                Kullanıcı Adı
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                placeholder="Örn: ahmet123"
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
                placeholder="••••••••"
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
            <a href="#" className="text-blue-400 hover:underline">
              Kayıt Ol
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

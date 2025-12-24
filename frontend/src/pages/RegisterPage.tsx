import { useState, useEffect } from "react";
import api from "../api/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom"; // Link ve useNavigate önemli

const RegisterPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/", { replace: true });
    }
  }, []);

  // Form verilerini tek bir state objesinde tutalım
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Backend'deki endpoint genelde '/auth/register' veya '/users' olur.
      // Senin backend yapına göre burası '/auth/register' olmalı.
      await api.post("/auth/register", formData);

      toast.success("Kayıt Başarılı! Giriş sayfasına yönlendiriliyorsun... 🎉");

      // 2 saniye sonra Login sayfasına at
      setTimeout(() => {
        // 👇 BURAYI DEĞİŞTİR: { replace: true } ekledik.
        // Bu sayede "Kayıt Ol" sayfası tarihe karışır, "Geri" tuşu buraya dönemez.
        navigate("/login", { replace: true });
      }, 2000);
    } catch (error: any) {
      console.error("Kayıt Hatası:", error);
      // Backend'den gelen özel hata mesajı varsa onu göster, yoksa genel mesaj
      const errorMessage =
        error.response?.data?.message || "Kayıt başarısız oldu.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      <nav className="w-full p-6 border-b border-gray-800">
        <h1 className="text-3xl font-bold text-blue-500 tracking-wide">
          📚 Kitap Platformu
        </h1>
      </nav>

      <div className="flex-1 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
          <h2 className="text-2xl font-bold text-center mb-6 text-white">
            Aramıza Katıl 🚀
          </h2>

          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Kullanıcı Adı
              </label>
              <input
                type="text"
                name="username"
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                placeholder="Kullanıcı adın"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                E-posta Adresi
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                placeholder="ornek@email.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Şifre
              </label>
              <input
                type="password"
                name="password"
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                placeholder="Güçlü bir şifre seç"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold transition duration-200 shadow-lg transform hover:scale-[1.02]"
            >
              Kayıt Ol
            </button>
          </form>

          <p className="text-center text-gray-400 mt-4 text-sm">
            Zaten hesabın var mı?{" "}
            {/* React Router Link'i kullanıyoruz, sayfa yenilenmesin diye */}
            <Link to="/login" className="text-green-400 hover:underline">
              Giriş Yap
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// İkonlarımızı ekliyoruz
import {
  FaUser,
  FaSearch,
  FaStar,
  FaPenNib,
  FaSignOutAlt,
} from "react-icons/fa";

interface Book {
  id: number;
  title: string;
  author: string;
}

const HomePage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Hızlı Yorum State'leri
  const [selectedBookId, setSelectedBookId] = useState<string>("");
  const [rating, setRating] = useState(0); // 0 ile 5 arası
  const [reviewText, setReviewText] = useState("");
  const [hoverRating, setHoverRating] = useState(0); // Yıldızların üzerine gelince renk değişsin

  useEffect(() => {
    // 1. Önce rol kontrolü yap
    const role = localStorage.getItem("role");

    // 🛑 EĞER ADMİN İSE, BURADA DURAMAZ!
    if (role === "admin" || role === "Admin") {
      navigate("/admin", { replace: true }); // Admin paneline postala
      return; // Aşağıdaki kodları çalıştırma
    }
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await api.get("/book");
      setBooks(response.data);
    } catch (error) {
      console.error("Hata:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // Sayfayı tamamen yenileyerek Login'e git (React hafızası sıfırlanır)
    window.location.href = "/login";
  };

  // Hızlı Yorum Gönderme Fonksiyonu
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookId || !reviewText || rating === 0) {
      toast.warning("Lütfen kitap seçin, puan verin ve yorum yazın! ⚠️");
      return;
    }

    try {
      // Backend'e yorumu ve puanı gönderiyoruz
      // NOT: Backend'inde 'rating' alanı yoksa şimdilik sadece yorum gider.
      await api.post("/comment", {
        content: reviewText,
        bookId: Number(selectedBookId),
        // rating: rating (Bunu backend'e ekleyince açarız)
      });

      toast.success(
        `Harika! "${
          books.find((b) => b.id === Number(selectedBookId))?.title
        }" için yorumun alındı. 🎉`
      );
      setReviewText("");
      setRating(0);
      setSelectedBookId("");
    } catch (error) {
      toast.error("Yorum gönderilemedi.");
    }
  };

  // Arama filtresi
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* 🟢 1. SOL PANEL (SIDEBAR) */}
      <aside className="w-64 bg-gray-800 border-r border-gray-700 hidden md:flex md:flex-col p-6 sticky top-0 h-screen">
        <h1 className="text-2xl font-bold text-blue-500 mb-10 flex items-center gap-2">
          📚 KitapYorum
        </h1>

        <nav className="flex-1 space-y-4">
          <button className="flex items-center gap-3 text-lg font-medium text-white bg-gray-700 w-full p-3 rounded-lg transition">
            🏠 Ana Sayfa
          </button>

          {/* Profil Linki */}
          <button
            onClick={() => toast.info("Profil sayfası yakında eklenecek! 🛠️")}
            className="flex items-center gap-3 text-lg font-medium text-gray-400 hover:text-white hover:bg-gray-700 w-full p-3 rounded-lg transition"
          >
            <FaUser /> Profilim
          </button>
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-400 hover:text-red-300 transition mt-auto font-bold"
        >
          <FaSignOutAlt /> Çıkış Yap
        </button>
      </aside>

      {/* 🟢 2. ORTA ALAN (MAIN CONTENT) */}
      <main className="flex-1 p-8 max-w-4xl mx-auto">
        {/* Arama Çubuğu */}
        <div className="relative mb-10 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400 group-focus-within:text-blue-500 transition" />
          </div>
          <input
            type="text"
            className="w-full bg-gray-800 border border-gray-700 rounded-full py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg transition"
            placeholder="Hangi kitabın yorumlarını merak ediyorsun? (Örn: Suç ve Ceza)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Arama Sonuçları (Sadece bir şey yazınca çıkar) */}
          {searchTerm && (
            <div className="absolute top-full left-0 right-0 bg-gray-800 border border-gray-700 rounded-xl mt-2 shadow-2xl z-50 overflow-hidden">
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => navigate(`/book/${book.id}`)}
                    className="p-4 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-0 transition"
                  >
                    <p className="font-bold text-blue-400">{book.title}</p>
                    <p className="text-xs text-gray-400">{book.author}</p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-gray-500 text-center">
                  Kitap bulunamadı.
                </div>
              )}
            </div>
          )}
        </div>

        {/* 🟢 3. YENİ KİTAP İNCELEME KUTUSU (FEED ORTASI) */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 mb-8">
          <div className="flex items-center gap-3 mb-4 border-b border-gray-700 pb-4">
            <div className="bg-blue-600 p-2 rounded-full text-white">
              <FaPenNib />
            </div>
            <h2 className="text-xl font-bold">Yeni bir kitap mı okudun?</h2>
          </div>

          <form onSubmit={handleSubmitReview}>
            {/* Kitap Seçimi */}
            <div className="mb-4">
              <select
                className="w-full bg-gray-900 border border-gray-600 text-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedBookId}
                onChange={(e) => setSelectedBookId(e.target.value)}
              >
                <option value="">İncelediğin kitabı seç...</option>
                {books.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title} - {book.author}
                  </option>
                ))}
              </select>
            </div>

            {/* Yıldızlama Sistemi */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-gray-400 mr-2">Puanın:</span>
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <label key={index} className="cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      value={ratingValue}
                      className="hidden"
                      onClick={() => setRating(ratingValue)}
                    />
                    <FaStar
                      size={24}
                      className="transition-colors duration-200"
                      color={
                        ratingValue <= (hoverRating || rating)
                          ? "#ffc107"
                          : "#4b5563"
                      }
                      onMouseEnter={() => setHoverRating(ratingValue)}
                      onMouseLeave={() => setHoverRating(0)}
                    />
                  </label>
                );
              })}
            </div>

            {/* Yorum Alanı */}
            <textarea
              className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none mb-4"
              placeholder="Düşüncelerini buraya yaz..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition shadow-lg transform hover:scale-105"
              >
                Paylaş
              </button>
            </div>
          </form>
        </div>

        {/* Alt kısma belki son eklenen yorumlar veya öneriler gelebilir */}
        <p className="text-center text-gray-500 text-sm mt-10">
          Daha fazla kitap keşfetmek için yukarıdaki arama çubuğunu kullan! 👆
        </p>
      </main>
    </div>
  );
};

export default HomePage;

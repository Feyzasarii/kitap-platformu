import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaUser,
  FaSearch,
  FaStar,
  FaPenNib,
  FaSignOutAlt,
  FaQuoteLeft,
  FaUserCircle,
} from "react-icons/fa";

const HomePage = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Hızlı Yorum State'leri
  const [selectedBookId, setSelectedBookId] = useState<string>("");
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    // 1. Rol Kontrolü: Admin ise admin paneline postala
    const role = localStorage.getItem("role");
    if (role === "admin" || role === "Admin") {
      navigate("/admin", { replace: true });
      return;
    }
    fetchInitialData();
  }, [navigate]);

  const fetchInitialData = async () => {
    try {
      // 2. Kitapları ve Yorumları eş zamanlı çekiyoruz
      const [bookRes, commentRes] = await Promise.all([
        api.get("/book"),
        api.get("/comment"),
      ]);
      setBooks(bookRes.data);
      setComments(commentRes.data);
    } catch (error) {
      console.error("Veriler çekilemedi:", error);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookId || !reviewText || rating === 0) {
      toast.warning("Lütfen kitap seçin, puan verin ve yorum yazın! ⚠️");
      return;
    }

    try {
      // 3. Backend DTO'su ile tam uyumlu gönderim (text, score, bookId)
      await api.post("/comment", {
        text: reviewText,
        score: Number(rating),
        bookId: Number(selectedBookId),
      });

      toast.success("İncelemen başarıyla paylaşıldı! 🚀");

      // Formu temizle
      setReviewText("");
      setRating(0);
      setSelectedBookId("");

      // Akışı anında tazele
      const commentRes = await api.get("/comment");
      setComments(commentRes.data);
    } catch (error) {
      toast.error("Yorum paylaşılamadı.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const filteredBooks = books.filter((b) =>
    b.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* 🟢 SOL SİDEBAR */}
      <aside className="w-64 bg-gray-800 border-r border-gray-700 hidden md:flex md:flex-col p-6 sticky top-0 h-screen">
        <h1 className="text-2xl font-bold text-blue-500 mb-10 flex items-center gap-2">
          📚 Kitap Yorum Platformu 📚
        </h1>
        <nav className="flex-1 space-y-4">
          <button className="flex items-center gap-3 text-lg font-medium text-white bg-gray-700 w-full p-3 rounded-xl transition">
            🏠 Ana Sayfa
          </button>
          <button
            onClick={() => navigate("/profile")} // 👈 Artık Profil sayfasına gidiyor!
            className="flex items-center gap-3 text-lg font-medium text-gray-400 hover:text-white hover:bg-gray-700 w-full p-3 rounded-lg transition"
          >
            <FaUserCircle /> Profilim
          </button>
        </nav>
        <button
          onClick={() => setIsLogoutModalOpen(true)}
          className="flex items-center gap-2 text-red-400 hover:text-red-300 transition mt-auto font-bold"
        >
          <FaSignOutAlt /> Çıkış Yap
        </button>
      </aside>

      {/* 🟢 ANA İÇERİK ALANI */}
      <main className="flex-1 p-8 max-w-4xl mx-auto overflow-y-auto">
        {/* ARAMA MOTORU */}
        <div className="relative mb-10 group">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition" />
          <input
            type="text"
            className="w-full bg-gray-800 border border-gray-700 rounded-full py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg transition"
            placeholder="Okumak istediğin bir kitabı mı arıyorsun?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <div className="absolute top-full left-0 right-0 bg-gray-800 border border-gray-700 rounded-xl mt-2 shadow-2xl z-50 overflow-hidden">
              {filteredBooks.map((b) => (
                <div
                  key={b.id}
                  onClick={() => navigate(`/book/${b.id}`)}
                  className="p-4 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-0 transition"
                >
                  <p className="font-bold text-blue-400">{b.title}</p>
                  <p className="text-xs text-gray-400">{b.author}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* HIZLI İNCELEME KUTUSU */}
        <div className="bg-gray-800 p-6 rounded-3xl border border-gray-700 shadow-2xl mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-600 p-2 rounded-full text-white shadow-lg">
              <FaPenNib />
            </div>
            <h2 className="text-xl font-bold">Yeni bir kitap mı okudun?</h2>
          </div>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <select
              className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={selectedBookId}
              onChange={(e) => setSelectedBookId(e.target.value)}
            >
              <option value="">İncelediğin kitabı seç...</option>
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400 mr-2">Puanın:</span>
              {[...Array(5)].map((_, i) => {
                const v = i + 1;
                return (
                  <FaStar
                    key={v}
                    size={24}
                    className={`cursor-pointer transition-colors ${
                      v <= (hoverRating || rating)
                        ? "text-yellow-500"
                        : "text-gray-700"
                    }`}
                    onClick={() => setRating(v)}
                    onMouseEnter={() => setHoverRating(v)}
                    onMouseLeave={() => setHoverRating(0)}
                  />
                );
              })}
            </div>
            <textarea
              className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 h-24 resize-none outline-none focus:ring-2 focus:ring-blue-500 transition text-white"
              placeholder="Düşüncelerini buraya yaz..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition shadow-lg transform active:scale-95"
            >
              Paylaş
            </button>
          </form>
        </div>

        {/* 🟢 SOSYAL AKIŞ (FEED) */}
        <div className="space-y-8">
          <div className="flex items-center gap-3 border-b border-gray-800 pb-2 mb-6">
            <h2 className="text-xl font-bold text-gray-300">
              Diğer kullanıcıların yorumlarına göz at 👀
            </h2>
          </div>

          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-blue-900/40 transition-all shadow-xl group"
            >
              <div className="flex flex-col gap-4">
                {/* Kitap Bilgisi (BÜYÜK BAŞLIK) */}
                <div className="flex justify-between items-start">
                  <div
                    onClick={() => navigate(`/book/${comment.book?.id}`)}
                    className="cursor-pointer group-hover:text-blue-400 transition-colors"
                  >
                    <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-1">
                      {comment.book?.title}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">
                      {comment.book?.author}
                    </p>
                  </div>
                  <div className="flex text-yellow-500 bg-gray-900/50 px-3 py-1 rounded-full border border-gray-700">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        size={14}
                        className={
                          i < comment.score ? "fill-current" : "text-gray-700"
                        }
                      />
                    ))}
                  </div>
                </div>

                {/* Yorum Metni */}
                <div className="bg-gray-900/40 p-5 rounded-xl border-l-4 border-blue-600 italic text-gray-300 relative">
                  <FaQuoteLeft
                    className="text-gray-700 absolute -top-2 -left-2"
                    size={20}
                  />
                  <p className="pl-2 leading-relaxed text-lg">{comment.text}</p>
                </div>

                {/* Yapan Kullanıcı Bilgisi */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-700/50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                      {comment.user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-blue-400">
                      @{comment.user?.username}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">
                    {new Date(comment.createdAt).toLocaleDateString("tr-TR")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 🔴 ÇIKIŞ ONAY MODALI */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 p-8 rounded-3xl border border-gray-700 text-center max-w-sm shadow-2xl">
            <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              <FaSignOutAlt />
            </div>
            <h3 className="text-xl font-bold mb-2">Çıkış Yapılıyor</h3>
            <p className="text-gray-400 mb-6">
              Hesabınızdan güvenli bir şekilde çıkış yapmak istediğinize emin
              misiniz?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 py-3 bg-gray-700 rounded-xl hover:bg-gray-600 transition"
              >
                Vazgeç
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 bg-red-600 rounded-xl font-bold hover:bg-red-700 transition"
              >
                Evet, Çık
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";
import {
  FaStar,
  FaArrowLeft,
  FaBookOpen,
  FaTags,
  FaQuoteLeft,
  FaUserCircle,
  FaCalendarAlt,
  FaPenNib,
} from "react-icons/fa";

const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<any>(null);
  const [newComment, setNewComment] = useState("");
  const [score, setScore] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      const response = await api.get(`/book/${id}`);
      setBook(response.data);
    } catch (error) {
      toast.error("Kitap detayları alınamadı.");
      navigate("/");
    }
  };

  const handleSendComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.warn("Lütfen bir yorum yazın.");
      return;
    }

    try {
      await api.post("/comment", {
        text: newComment, // Backend 'text' bekliyor
        score: Number(score),
        bookId: Number(id),
      });
      toast.success("Değerlendirmen başarıyla eklendi! ✨");
      setNewComment("");
      setScore(5);
      fetchBookDetails(); // Veriyi tazele
    } catch (error) {
      toast.error("Yorum gönderilemedi.");
    }
  };

  if (!book)
    return (
      <div className="text-white text-center mt-20 animate-pulse">
        Kitap bilgileri yükleniyor...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex">
      {/* 🟢 SIDEBAR (Tutarlılık için HomePage ile aynı) */}
      <aside className="w-64 bg-gray-800 border-r border-gray-700 hidden lg:flex lg:flex-col p-6 sticky top-0 h-screen">
        <h1 className="text-2xl font-bold text-blue-500 mb-10">📚 KitapLog</h1>
        <nav className="flex-1 space-y-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 text-gray-400 hover:text-white w-full p-3 rounded-xl transition"
          >
            🏠 Ana Sayfa
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-3 text-gray-400 hover:text-white w-full p-3 rounded-xl transition"
          >
            <FaUserCircle /> Profilim
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-4 md:p-10 max-w-6xl mx-auto overflow-y-auto">
        {/* GERİ DÖN BUTONU */}
        <button
          onClick={() => navigate("/")}
          className="mb-8 flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-all font-semibold"
        >
          <FaArrowLeft /> Listeye Dön
        </button>

        {/* 🟢 KİTAP HERO BÖLÜMÜ (Modern ve Büyük) */}
        <div className="bg-gray-800 rounded-3xl overflow-hidden border border-gray-700 shadow-2xl flex flex-col md:flex-row mb-12 transform transition hover:shadow-blue-900/20">
          <div className="md:w-1/3 relative group">
            <img
              src={
                book.imageUrl ||
                "https://via.placeholder.com/400x600?text=Kitap+Kapağı"
              }
              className="w-full h-full object-cover min-h-[400px]"
              alt={book.title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
          </div>

          <div className="p-8 md:p-12 flex-1 flex flex-col justify-center">
            <div className="flex flex-wrap gap-2 mb-4">
              {book.categories?.map((cat: any) => (
                <span
                  key={cat.id}
                  className="bg-blue-900/40 text-blue-400 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest border border-blue-800"
                >
                  {cat.name}
                </span>
              ))}
            </div>

            <h1 className="text-5xl font-black text-white mb-2 leading-tight uppercase tracking-tighter">
              {book.title}
            </h1>
            <p className="text-2xl text-gray-400 font-medium mb-6 italic">
              by {book.author}
            </p>

            <div className="flex gap-6 mb-8 text-gray-400 text-sm">
              <span className="flex items-center gap-2">
                <FaBookOpen className="text-blue-500" />{" "}
                {book.pageCount || "???"} Sayfa
              </span>
              <span className="flex items-center gap-2">
                <FaCalendarAlt className="text-blue-500" />{" "}
                {book.publishYear || "Belirtilmemiş"}
              </span>
            </div>

            <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-700">
              <p className="text-gray-300 leading-relaxed italic line-clamp-4">
                {book.description ||
                  "Bu kitap için henüz detaylı bir açıklama eklenmemiş."}
              </p>
            </div>
          </div>
        </div>

        {/* 🟢 ETKİLEŞİM VE YORUMLAR */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Yorum Yapma Paneli (Sol) */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 p-8 rounded-3xl border border-gray-700 shadow-xl sticky top-10">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FaPenNib className="text-blue-500" /> İnceleme Yaz
              </h3>
              <form onSubmit={handleSendComment} className="space-y-6">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-widest font-bold block mb-3">
                    Puanın
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <FaStar
                        key={num}
                        size={28}
                        className={`cursor-pointer transition-all transform hover:scale-110 ${
                          num <= (hoverRating || score)
                            ? "text-yellow-500 shadow-yellow-500"
                            : "text-gray-700"
                        }`}
                        onClick={() => setScore(num)}
                        onMouseEnter={() => setHoverRating(num)}
                        onMouseLeave={() => setHoverRating(0)}
                      />
                    ))}
                  </div>
                </div>

                <textarea
                  className="w-full bg-gray-900 border border-gray-700 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none h-40 resize-none transition-all"
                  placeholder="Düşüncelerini buraya dök..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />

                <button
                  type="submit"
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl font-black text-lg transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95"
                >
                  YORUMU PAYLAŞ
                </button>
              </form>
            </div>
          </div>

          {/* Yorum Akışı (Sağ) */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-2xl font-bold border-b border-gray-800 pb-4 mb-8 text-gray-400">
              Tüm İncelemeler ({book.comments?.length || 0})
            </h3>

            {book.comments?.length > 0 ? (
              book.comments.map((comment: any) => (
                <div
                  key={comment.id}
                  className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg relative overflow-hidden group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center font-bold text-white shadow-md">
                        {comment.user?.username?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-blue-400">
                          @{comment.user?.username}
                        </p>
                        <p className="text-[10px] text-gray-600 uppercase font-mono tracking-tighter">
                          {new Date(comment.createdAt).toLocaleDateString(
                            "tr-TR"
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex text-yellow-500 bg-gray-900/50 px-2 py-1 rounded-lg border border-gray-700">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          size={12}
                          className={
                            i < comment.score ? "fill-current" : "text-gray-700"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <div className="relative pl-6">
                    <FaQuoteLeft
                      className="text-gray-700 absolute left-0 top-0"
                      size={16}
                    />
                    <p className="text-gray-300 leading-relaxed italic text-lg">
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-700">
                <p className="text-gray-500 text-lg">
                  Henüz kimse yorum yapmamış. İlk yorumu sen yapmaya ne dersin?
                  🖋️
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookDetailPage;

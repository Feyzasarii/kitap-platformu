import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";
import {
  FaUserCircle,
  FaStar,
  FaTrash,
  FaArrowLeft,
  FaBookOpen,
} from "react-icons/fa";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [myReviews, setMyReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      // Backend profil endpoint'ini burada kontrol et (/user/profile mı /auth/profile mı?)
      const [userRes, reviewsRes] = await Promise.all([
        api.get("/user/profile"), // Genelde user altındadır
        api.get("/comment/my-reviews"),
      ]);

      setUser(userRes.data);
      setMyReviews(reviewsRes.data);
    } catch (error) {
      console.error("Veri çekme hatası:", error);
      toast.error("Bilgiler getirilemedi. Lütfen tekrar giriş yapın.");
      // Hata durumunda yükleniyor ekranından çık ve ana sayfaya postala
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Bu yorumu silmek istiyor musun?")) {
      try {
        await api.delete(`/comment/${id}`);
        toast.success("Yorum silindi.");
        setMyReviews((prev) => prev.filter((r) => r.id !== id));
      } catch (error) {
        toast.error("Silme başarısız.");
      }
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white font-bold">
        Veriler Yükleniyor...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition"
        >
          <FaArrowLeft /> Ana Sayfaya Dön
        </button>

        <div className="bg-[#1e293b] rounded-3xl p-8 border border-gray-800 flex items-center gap-6 mb-10">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-3xl font-bold uppercase">
            {user?.username?.[0] || "U"}
          </div>
          <div>
            <h1 className="text-3xl font-black">
              @{user?.username || "Bilinmiyor"}
            </h1>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            <div className="mt-2 text-blue-400 font-bold">
              Toplam İnceleme: {myReviews.length}
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <FaBookOpen className="text-blue-500" /> Paylaştığım Yorumlar
        </h2>

        <div className="space-y-4">
          {myReviews.map((review) => (
            <div
              key={review.id}
              className="bg-[#1e293b] p-6 rounded-2xl border border-gray-800"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-blue-400">
                    {review.book?.title}
                  </h3>
                  <div className="flex text-yellow-500 mt-1">
                    {[...Array(review.score)].map((_, i) => (
                      <FaStar key={i} size={12} />
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="text-red-500 hover:bg-red-500/10 p-2 rounded"
                >
                  <FaTrash />
                </button>
              </div>
              <p className="mt-4 text-gray-300 italic">"{review.text}"</p>
            </div>
          ))}
          {myReviews.length === 0 && (
            <p className="text-gray-500 text-center py-10">
              Henüz yorum yapmamışsın.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

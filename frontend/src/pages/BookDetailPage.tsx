import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";

// Tipleri tanımlayalım
interface Comment {
  id: number;
  content: string;
  user?: {
    username: string;
  };
}

interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  comments: Comment[];
}

const BookDetailPage = () => {
  const { id } = useParams(); // URL'den id'yi al
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      const response = await api.get(`/book/${id}`);
      setBook(response.data);
    } catch (error) {
      toast.error("Kitap detayları alınamadı.");
      navigate("/"); // Hata varsa ana sayfaya dön
    }
  };

  const handleSendComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await api.post("/comment", {
        content: newComment,
        bookId: Number(id),
      });
      toast.success("Yorum gönderildi! 🚀");
      setNewComment("");
      fetchBookDetails(); // Yorumları güncellemek için sayfayı yenile
    } catch (error) {
      toast.error("Yorum gönderilemedi.");
    }
  };

  if (!book)
    return <div className="text-white text-center mt-20">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="mb-6 text-gray-400 hover:text-white transition"
        >
          ← Listeye Dön
        </button>

        {/* Kitap Bilgisi */}
        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl mb-8 border border-gray-700">
          <h1 className="text-4xl font-bold text-blue-500 mb-2">
            {book.title}
          </h1>
          <h2 className="text-xl text-gray-400 mb-6">{book.author}</h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            {book.description}
          </p>
        </div>

        {/* Yorumlar */}
        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
          <h3 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">
            Yorumlar ({book.comments?.length || 0})
          </h3>

          <div className="space-y-4 mb-8 max-h-96 overflow-y-auto">
            {book.comments?.length > 0 ? (
              book.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-gray-900 p-4 rounded border border-gray-700"
                >
                  <p className="text-gray-300">{comment.content}</p>
                  <p className="text-xs text-blue-400 mt-2 font-bold">
                    - {comment.user?.username || "Anonim"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">İlk yorumu sen yap!</p>
            )}
          </div>

          {/* Yorum Formu */}
          <form onSubmit={handleSendComment} className="flex gap-4">
            <input
              type="text"
              className="flex-1 bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Yorum yaz..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition"
            >
              Gönder
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;

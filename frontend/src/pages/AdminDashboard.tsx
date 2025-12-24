import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaPlus,
  FaTrash,
  FaSignOutAlt,
  FaBook,
  FaUsers,
  FaSearch,
  FaEdit,
} from "react-icons/fa";

interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
}

const AdminDashboard = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Düzenleme için seçilen kitap (Boşsa ekleme modundayız demektir)
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    description: "",
  });

  useEffect(() => {
    // 1. Rol kontrolü
    const role = localStorage.getItem("role");

    // 🛑 EĞER ADMİN DEĞİLSE, BURADA DURAMAZ!
    if (role !== "admin" && role !== "Admin") {
      toast.error("Bu alana giriş yetkiniz yok! ⛔");
      navigate("/", { replace: true });
      return;
    }
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await api.get("/book");
      setBooks(response.data);
    } catch (error) {
      toast.error("Veriler çekilemedi.");
    }
  };

  const handleDeleteBook = async (id: number) => {
    if (!confirm("Bu kitabı kalıcı olarak silmek istediğine emin misin?"))
      return;
    try {
      await api.delete(`/book/${id}`);
      toast.success("Kitap silindi.");
      fetchBooks();
    } catch (error) {
      toast.error("Silme başarısız.");
    }
  };

  // 👇 YENİ: DÜZENLEME MODUNU AÇAR
  const handleEditClick = (book: Book) => {
    setEditingBook(book); // Düzenlenecek kitabı hafızaya al
    setNewBook({
      // Formu o kitabın bilgileriyle doldur
      title: book.title,
      author: book.author,
      description: book.description,
    });
    setIsModalOpen(true); // Modalı aç
  };

  // 👇 YENİ: EKLEME MODUNU AÇAR (Temiz sayfa)
  const handleOpenAddModal = () => {
    setEditingBook(null); // Düzenleme modunu kapat
    setNewBook({ title: "", author: "", description: "" }); // Formu temizle
    setIsModalOpen(true);
  };

  // 👇 GÜNCELLENDİ: HEM EKLEME HEM GÜNCELLEME YAPAR
  const handleSaveBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBook) {
        // --- GÜNCELLEME İŞLEMİ (PUT) ---
        await api.put(`/book/${editingBook.id}`, newBook);
        toast.success("Kitap güncellendi! ✍️");
      } else {
        // --- EKLEME İŞLEMİ (POST) ---
        await api.post("/book", newBook);
        toast.success("Yeni kitap eklendi! 🎉");
      }

      // Temizlik ve Kapatma
      setIsModalOpen(false);
      setEditingBook(null);
      setNewBook({ title: "", author: "", description: "" });
      fetchBooks(); // Listeyi yenile
    } catch (error) {
      toast.error("İşlem başarısız.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  // 🔍 FİLTRELEME MANTIĞI
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* SOL MENÜ (SIDEBAR) */}
      <aside className="w-64 bg-gray-800 border-r border-gray-700 p-6 flex flex-col">
        <h1 className="text-2xl font-bold text-red-500 mb-8 flex items-center gap-2">
          🛡️ Admin Panel
        </h1>
        <nav className="flex-1 space-y-4">
          <div className="p-3 bg-gray-700 rounded text-white font-bold flex items-center gap-2">
            <FaBook /> Kitap Yönetimi
          </div>
          <div className="p-3 text-gray-400 hover:text-white cursor-not-allowed flex items-center gap-2">
            <FaUsers /> Kullanıcılar (Yakında)
          </div>
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-400 hover:text-white mt-auto"
        >
          <FaSignOutAlt /> Çıkış
        </button>
      </aside>

      {/* İÇERİK ALANI */}
      <main className="flex-1 p-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold">Kitap Listesi</h2>

          {/* ARAMA KUTUSU */}
          <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Kitap adı veya yazar ara..."
              className="w-full bg-gray-800 border border-gray-600 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={handleOpenAddModal} // 👈 BURASI GÜNCELLENDİ
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition shadow-lg whitespace-nowrap"
          >
            <FaPlus /> Yeni Kitap
          </button>
        </div>

        {/* TABLO GÖRÜNÜMÜ */}
        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-xl border border-gray-700">
          <table className="w-full text-left">
            <thead className="bg-gray-700 text-gray-300 uppercase text-sm">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Kitap Adı</th>
                <th className="p-4">Yazar</th>
                <th className="p-4 text-center">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredBooks.map((book) => (
                <tr key={book.id} className="hover:bg-gray-700/50 transition">
                  <td className="p-4 text-gray-400">#{book.id}</td>
                  <td className="p-4 font-bold">{book.title}</td>
                  <td className="p-4 text-gray-300">{book.author}</td>
                  <td className="p-4 text-center flex justify-center gap-2">
                    {" "}
                    {/* Flex eklendi */}
                    {/* 👇 YENİ: DÜZENLE BUTONU */}
                    <button
                      onClick={() => handleEditClick(book)}
                      className="bg-yellow-500/20 text-yellow-400 p-2 rounded hover:bg-yellow-500 hover:text-black transition"
                    >
                      <FaEdit />
                    </button>
                    {/* SİL BUTONU */}
                    <button
                      onClick={() => handleDeleteBook(book.id)}
                      className="bg-red-500/20 text-red-400 p-2 rounded hover:bg-red-600 hover:text-white transition"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredBooks.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              {searchTerm
                ? "Aradığınız kriterde kitap bulunamadı. 🔍"
                : "Kayıtlı kitap yok."}
            </div>
          )}
        </div>
      </main>

      {/* EKLEME / DÜZENLEME MODALI */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md border border-gray-600 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>

            {/* 👇 BAŞLIK DİNAMİK */}
            <h3 className="text-xl font-bold mb-4 text-green-400">
              {editingBook ? "Kitabı Düzenle ✏️" : "Yeni Kitap Ekle 📚"}
            </h3>

            <form onSubmit={handleSaveBook} className="space-y-4">
              <input
                required
                placeholder="Kitap Adı"
                className="w-full bg-gray-900 border border-gray-600 p-2 rounded text-white"
                value={newBook.title}
                onChange={(e) =>
                  setNewBook({ ...newBook, title: e.target.value })
                }
              />
              <input
                required
                placeholder="Yazar"
                className="w-full bg-gray-900 border border-gray-600 p-2 rounded text-white"
                value={newBook.author}
                onChange={(e) =>
                  setNewBook({ ...newBook, author: e.target.value })
                }
              />
              <textarea
                required
                placeholder="Açıklama"
                className="w-full bg-gray-900 border border-gray-600 p-2 rounded text-white h-24"
                value={newBook.description}
                onChange={(e) =>
                  setNewBook({ ...newBook, description: e.target.value })
                }
              />

              {/* 👇 BUTON METNİ DİNAMİK */}
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 py-2 rounded font-bold text-white transition transform hover:scale-[1.02]"
              >
                {editingBook ? "Güncelle" : "Kaydet"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

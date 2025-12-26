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
  FaSearch, // Arama ikonu
  FaEdit,
  FaTags,
  FaImage,
} from "react-icons/fa";

interface Category {
  id: number;
  name: string;
}

interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  pageCount?: number;
  publisher?: string;
  publishYear?: number;
  imageUrl?: string;
  categories?: Category[];
}

const AdminDashboard = () => {
  const navigate = useNavigate();

  // --- STATE YÖNETİMİ ---
  const [activeTab, setActiveTab] = useState<"books" | "categories">("books");

  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  // Form Verileri
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    pageCount: "",
    publisher: "",
    publishYear: "",
    imageUrl: "",
    categoryIds: [] as number[],
  });

  const [newCategoryName, setNewCategoryName] = useState("");

  // Modallar
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCategoryDeleteModalOpen, setIsCategoryDeleteModalOpen] =
    useState(false);

  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  // --- API ---

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin" && role !== "Admin") {
      navigate("/", { replace: true });
      return;
    }
    if (activeTab === "books") fetchBooks();
    if (activeTab === "categories") fetchCategories();
  }, [activeTab]);

  const fetchBooks = async () => {
    try {
      const res = await api.get("/book");
      setBooks(res.data);
    } catch (error) {
      toast.error("Kitaplar yüklenemedi");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/category");
      setCategories(res.data);
    } catch (error) {
      toast.error("Kategoriler yüklenemedi");
    }
  };

  // --- FORM İŞLEMLERİ ---

  const toggleCategorySelection = (catId: number) => {
    setFormData((prev) => {
      const isSelected = prev.categoryIds.includes(catId);
      if (isSelected) {
        return {
          ...prev,
          categoryIds: prev.categoryIds.filter((id) => id !== catId),
        };
      } else {
        return { ...prev, categoryIds: [...prev.categoryIds, catId] };
      }
    });
  };

  const handleOpenAddModal = () => {
    fetchCategories();
    setEditingBook(null);
    setFormData({
      title: "",
      author: "",
      description: "",
      pageCount: "",
      publisher: "",
      publishYear: "",
      imageUrl: "",
      categoryIds: [],
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (book: Book) => {
    fetchCategories();
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      description: book.description,
      pageCount: book.pageCount ? book.pageCount.toString() : "",
      publisher: book.publisher || "",
      publishYear: book.publishYear ? book.publishYear.toString() : "",
      imageUrl: book.imageUrl || "",
      categoryIds: book.categories ? book.categories.map((c) => c.id) : [],
    });
    setIsModalOpen(true);
  };

  const handleSaveBook = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: formData.title,
      author: formData.author,
      description: formData.description,
      pageCount: formData.pageCount ? parseInt(formData.pageCount) : null,
      publishYear: formData.publishYear ? parseInt(formData.publishYear) : null,
      publisher: formData.publisher,
      imageUrl: formData.imageUrl,
      categories: formData.categoryIds.map((id) => ({ id })),
    };

    try {
      if (editingBook) {
        await api.put(`/book/${editingBook.id}`, payload);
        toast.success("Kitap güncellendi! ✍️");
      } else {
        await api.post("/book", payload);
        toast.success("Yeni kitap eklendi! 🎉");
      }
      setIsModalOpen(false);
      fetchBooks();
    } catch (error) {
      toast.error("Kaydetme başarısız.");
    }
  };

  // --- SİLME ---
  const handleDeleteBookClick = (id: number) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };
  const confirmDeleteBook = async () => {
    if (!itemToDelete) return;
    try {
      await api.delete(`/book/${itemToDelete}`);
      toast.success("Silindi.");
      fetchBooks();
    } catch {
      toast.error("Hata oluştu.");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const handleDeleteCategoryClick = (id: number) => {
    setItemToDelete(id);
    setIsCategoryDeleteModalOpen(true);
  };
  const confirmDeleteCategory = async () => {
    if (!itemToDelete) return;
    try {
      await api.delete(`/category/${itemToDelete}`);
      toast.success("Silindi.");
      fetchCategories();
    } catch {
      toast.error("Silinemedi.");
    } finally {
      setIsCategoryDeleteModalOpen(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      await api.post("/category", { name: newCategoryName });
      setNewCategoryName("");
      fetchCategories();
      toast.success("Eklendi");
    } catch {
      toast.error("Hata");
    }
  };

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-800 border-r border-gray-700 p-6 flex flex-col">
        <h1 className="text-2xl font-bold text-red-500 mb-8 flex items-center gap-2">
          🛡️ Admin Panel
        </h1>
        <nav className="flex-1 space-y-4">
          <button
            onClick={() => setActiveTab("books")}
            className={`w-full p-3 rounded text-left font-bold flex items-center gap-2 transition ${
              activeTab === "books"
                ? "bg-gray-700"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {" "}
            <FaBook /> Kitaplar{" "}
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`w-full p-3 rounded text-left font-bold flex items-center gap-2 transition ${
              activeTab === "categories"
                ? "bg-gray-700"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {" "}
            <FaTags /> Kategoriler{" "}
          </button>
        </nav>
        <button
          onClick={() => setIsLogoutModalOpen(true)}
          className="flex items-center gap-2 text-red-400 mt-auto"
        >
          {" "}
          <FaSignOutAlt /> Çıkış{" "}
        </button>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-8">
        {activeTab === "books" ? (
          <>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
              <h2 className="text-3xl font-bold">Kitap Listesi</h2>

              {/* 👇 ARAMA ÇUBUĞU GERİ GELDİ */}
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
                onClick={handleOpenAddModal}
                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-bold flex items-center gap-2 shadow-lg whitespace-nowrap"
              >
                {" "}
                <FaPlus /> Yeni Kitap{" "}
              </button>
            </div>

            {/* Kitap Tablosu */}
            <div className="bg-gray-800 rounded-xl overflow-hidden shadow-xl border border-gray-700">
              <table className="w-full text-left">
                <thead className="bg-gray-700 text-gray-300">
                  <tr>
                    <th className="p-4">ID</th>
                    <th className="p-4">Kitap</th>
                    <th className="p-4">Yazar</th>
                    <th className="p-4">Kategoriler</th>
                    <th className="p-4 text-center">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredBooks.map((book) => (
                    <tr key={book.id} className="hover:bg-gray-700/50">
                      <td className="p-4 text-gray-500">#{book.id}</td>
                      <td className="p-4 font-bold">{book.title}</td>
                      <td className="p-4 text-gray-300">{book.author}</td>
                      <td className="p-4 text-sm text-blue-300">
                        {book.categories?.map((c) => c.name).join(", ") || "-"}
                      </td>
                      <td className="p-4 text-center flex justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(book)}
                          className="text-yellow-400 bg-yellow-500/10 p-2 rounded"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteBookClick(book.id)}
                          className="text-red-400 bg-red-500/10 p-2 rounded"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          /* Kategori Yönetimi Ekranı */
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <FaTags className="text-yellow-500" /> Kategori Yönetimi
            </h2>
            <form onSubmit={handleAddCategory} className="flex gap-4 mb-8">
              <input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Yeni Kategori..."
                className="flex-1 bg-gray-800 border border-gray-600 rounded p-3 text-white"
              />
              <button className="bg-yellow-600 px-6 rounded font-bold">
                Ekle
              </button>
            </form>
            <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
              <table className="w-full text-left">
                <tbody className="divide-y divide-gray-700">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-gray-700/50">
                      <td className="p-4">#{cat.id}</td>
                      <td className="p-4 font-bold">{cat.name}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteCategoryClick(cat.id)}
                          className="text-red-400 bg-red-500/10 p-2 rounded"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ==================== SÜPER MODAL (KÜÇÜLTÜLMÜŞ & GÜZELEŞTİRİLMİŞ) ==================== */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          {/* 👇 max-w-lg yaparak daralttık (Daha kibar) */}
          <div className="bg-gray-800 p-5 rounded-xl w-full max-w-lg border border-gray-600 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold mb-4 text-green-400 flex items-center gap-2">
              {editingBook ? (
                <>
                  <FaEdit /> Kitabı Düzenle
                </>
              ) : (
                <>
                  <FaPlus /> Yeni Kitap Ekle
                </>
              )}
            </h3>

            <form onSubmit={handleSaveBook} className="space-y-3">
              {/* text-sm kullanarak her şeyi biraz küçülttük (%80 Zoom hissi) */}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">
                    Kitap Adı
                  </label>
                  <input
                    required
                    className="w-full bg-gray-900 border border-gray-600 p-2 rounded text-sm text-white focus:border-green-500 outline-none"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">
                    Yazar
                  </label>
                  <input
                    required
                    className="w-full bg-gray-900 border border-gray-600 p-2 rounded text-sm text-white focus:border-green-500 outline-none"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">
                    Sayfa
                  </label>
                  <input
                    type="number"
                    className="w-full bg-gray-900 border border-gray-600 p-2 rounded text-sm text-white focus:border-green-500 outline-none"
                    value={formData.pageCount}
                    onChange={(e) =>
                      setFormData({ ...formData, pageCount: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">
                    Yayınevi
                  </label>
                  <input
                    className="w-full bg-gray-900 border border-gray-600 p-2 rounded text-sm text-white focus:border-green-500 outline-none"
                    value={formData.publisher}
                    onChange={(e) =>
                      setFormData({ ...formData, publisher: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">
                    Yıl
                  </label>
                  <input
                    type="number"
                    className="w-full bg-gray-900 border border-gray-600 p-2 rounded text-sm text-white focus:border-green-500 outline-none"
                    value={formData.publishYear}
                    onChange={(e) =>
                      setFormData({ ...formData, publishYear: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">
                  Kapak Resmi (URL)
                </label>
                <div className="relative">
                  <FaImage className="absolute left-3 top-2.5 text-gray-500 text-sm" />
                  <input
                    placeholder="https://..."
                    className="w-full bg-gray-900 border border-gray-600 p-2 pl-9 rounded text-sm text-white focus:border-green-500 outline-none"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Kategori Seçimi */}
              <div>
                <label className="text-xs text-gray-400 block mb-1">
                  Kategoriler
                </label>
                <div className="flex flex-wrap gap-2 bg-gray-900 p-3 rounded border border-gray-600 max-h-24 overflow-y-auto custom-scrollbar">
                  {categories.map((cat) => {
                    const isSelected = formData.categoryIds.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleCategorySelection(cat.id)}
                        className={`px-2 py-1 rounded-md text-xs font-bold transition border ${
                          isSelected
                            ? "bg-blue-600 text-white border-blue-500"
                            : "bg-gray-800 text-gray-400 border-gray-600 hover:bg-gray-700"
                        }`}
                      >
                        {cat.name} {isSelected && "✓"}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">
                  Açıklama
                </label>
                <textarea
                  required
                  className="w-full bg-gray-900 border border-gray-600 p-2 rounded text-sm text-white h-20 focus:border-green-500 outline-none resize-none"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg font-bold text-white transition shadow-lg text-sm"
              >
                {editingBook ? "Kaydet" : "Oluştur"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SİLME MODALLARI AYNI KALDI (Gizli) */}
      {(isDeleteModalOpen ||
        isCategoryDeleteModalOpen ||
        isLogoutModalOpen) && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 p-6 rounded-xl w-full max-w-sm border border-gray-600 text-center">
            <h3 className="text-white font-bold text-lg mb-4">Emin misin?</h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setIsCategoryDeleteModalOpen(false);
                  setIsLogoutModalOpen(false);
                }}
                className="bg-gray-700 text-white px-4 py-2 rounded text-sm"
              >
                Hayır
              </button>
              <button
                onClick={() => {
                  if (isLogoutModalOpen) {
                    localStorage.clear();
                    window.location.href = "/login";
                  } else if (isDeleteModalOpen) confirmDeleteBook();
                  else confirmDeleteCategory();
                }}
                className="bg-red-600 text-white px-4 py-2 rounded text-sm"
              >
                Evet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

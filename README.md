📚 Kitap İnceleme ve Yönetim Platformu

Kitap tutkunlarının bir araya gelerek okudukları eserler hakkında yorum yapabildiği, puanlama sistemiyle topluluk geri bildirimi oluşturduğu ve kapsamlı bir kitap arşivi sunan Full-Stack bir web uygulamasıdır.

Bu proje ilişkisel veritabanı tasarımı, rol bazlı yetkilendirme ve modern web mimarilerini sergilemek amacıyla geliştirilmiştir.

🚀 Öne Çıkan Özellikler

🛡️ Gelişmiş Kimlik Doğrulama: JWT (JSON Web Token) tabanlı güvenli oturum yönetimi.

👥 Rol Bazlı Yetkilendirme (RBAC):

Admin: Kitap, kategori ve tüm kullanıcı yorumlarını yönetme (Ekleme, Silme, Güncelleme).

User: Kitapları inceleme, puan verme, yorum yapma ve kendi profilini yönetme.

📖 Dinamik İçerik Yönetimi: Kitapların kategorilerine göre filtrelenmesi ve detaylı incelenmesi.

💬 Etkileşimli Yorum Sistemi: Kullanıcıların kitaplara 1-5 arası puan vermesi ve metin tabanlı incelemeler bırakması.

🎨 Modern Arayüz: Tailwind CSS ile oluşturulmuş, kullanıcı deneyimi odaklı, karanlık tema destekli tasarım.






Backend kısmı (Mutfak):

Framework: NestJS (Node.js)

Dil: TypeScript

Veritabanı & ORM: PostgreSQL + TypeORM

Güvenlik: Passport.js, JWT, Bcrypt

Doğrulama: Class-Validator & Class-Transformer

Frontend kısmı (Vitrin):

Kütüphane: React.js (Vite)

Dil: TypeScript

Stil: Tailwind CSS

Durum Yönetimi: React Hooks (useState, useEffect)

Haberleşme: Axios (Interceptor destekli)

İkonlar: React Icons


🏗️ Mimari Yapı ve Veritabanı İlişkileri

Sistem, İlişkisel Veritabanı prensiplerine uygun olarak 5 ana tablo üzerine kurulmuştur:

User - Comment (1:N): Bir kullanıcı birden fazla yorum yapabilir.

Book - Comment (1:N): Bir kitap birden fazla yorum alabilir.

Book - Category (N:N): Bir kitap birden fazla kategoriye ait olabilir; bir kategori altında birçok kitap bulunabilir.

User - Role (N:1): Her kullanıcının sistemde tanımlı bir rolü (Admin/User) bulunur.



📝 Rapor Notları

Bu proje kapsamında NestJS'in modüler yapısı kullanılarak Separation of Concerns (Sorumlulukların Ayrılması) prensibi uygulanmıştır.

Veri güvenliği için ClassSerializerInterceptor kullanılarak hassas veriler (şifreler) API yanıtlarından otomatik olarak temizlenmektedir.

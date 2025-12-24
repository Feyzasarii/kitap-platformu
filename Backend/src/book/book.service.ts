import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { User } from '../user/entities/user.entity'; // User entity yolunu kontrol et

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  // User opsiyonel olabilir (? işareti koyduk) çünkü belki user olmadan test edersin
  async create(createBookDto: CreateBookDto, user?: User) {
    const book = new Book();

    // 1. Basit alanları doldur
    book.title = createBookDto.title;
    book.author = createBookDto.author;
    book.description = createBookDto.description;

    // Eğer DTO'da bu alanlar opsiyonelse ve gelmediyse undefined kalır, sorun yok
    book.pageCount = createBookDto.pageCount;
    book.publisher = createBookDto.publisher;
    book.coverImage = createBookDto.coverImage;

    // 2. İlişkileri Kur

    // a) Kitabı ekleyen kullanıcıyı ata (Eğer user geldiyse)
    if (user) {
      book.addedBy = user;
    }

    // b) EMNİYET KEMERİ BURADA 🛡️
    // Frontend henüz kategori göndermiyor olabilir. Eğer categoryIds varsa işlem yap.
    // Yoksa boş dizi veya null geç.
    if (createBookDto.categoryIds && createBookDto.categoryIds.length > 0) {
      book.categories = createBookDto.categoryIds.map((id) => ({ id }) as any);
    }

    // 3. Kaydet ve Döndür
    return this.bookRepository.save(book);
  }

  async findAll() {
    return this.bookRepository.find({
      // relations: ['addedBy', 'categories'], // Eğer entity'de bu ilişkiler tanımlı değilse hata verir. Şimdilik kapalı tutabilirsin veya entity hazırsa açabilirsin.
      order: { id: 'DESC' }, // createdAt yoksa id'ye göre sırala
    });
  }

  async findOne(id: number) {
    const book = await this.bookRepository.findOne({
      where: { id },
      // relations: ['addedBy', 'categories'], // İlişkiler hazırsa aç
    });

    if (!book) {
      // Frontend boş gelince hata sanmasın diye null dönüyoruz, isteğe bağlı throw yapılabilir
      return null;
    }
    return book;
  }

  // GÜNCELLEME (Update)
  async update(id: number, updateBookDto: any) {
    // 1. Kategoriler güncellenecek mi? Kontrol ediyoruz
    let categories = undefined;
    if (updateBookDto.categoryIds) {
      categories = updateBookDto.categoryIds.map((catId) => ({ id: catId }));
    }

    // 2. Preload: Eski veriyle yeniyi harmanla
    const book = await this.bookRepository.preload({
      id: id,
      ...updateBookDto,
      categories: categories, // Eğer undefined ise burayı hiç ellemez
    });

    if (!book) {
      throw new NotFoundException(`Book #${id} not found`);
    }

    return this.bookRepository.save(book);
  }

  // 🗑️ KİTAP SİLME
  async remove(id: number) {
    // Önce var mı diye bakmak yerine direkt delete atabiliriz, performans için
    const result = await this.bookRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Silinecek kitap (ID: ${id}) bulunamadı.`);
    }
    return { deleted: true };
  }
}

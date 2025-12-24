import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async create(createBookDto: CreateBookDto, user: User) {
    const book = new Book();

    // 1. Basit alanları doldur
    book.title = createBookDto.title;
    book.author = createBookDto.author;
    book.description = createBookDto.description;
    book.pageCount = createBookDto.pageCount;
    book.publisher = createBookDto.publisher;
    book.coverImage = createBookDto.coverImage;

    // 2. İlişkileri Kur (En Kritik Yer)

    // a) Kitabı ekleyen kullanıcıyı ata
    book.addedBy = user;

    // b) Kategori ID'lerini nesneye çevirip ata
    // Gelen [1, 3] dizisini -> [{id: 1}, {id: 3}] haline getiriyoruz.
    // TypeORM bunu görünce otomatik olarak ara tabloya kaydeder.
    book.categories = createBookDto.categoryIds.map((id) => ({ id }) as any);

    // 3. Kaydet ve Döndür
    return this.bookRepository.save(book);
  }

  // Şimdilik diğer metodlar boş kalsın veya hata vermemesi için basitçe bırakabilirsin
  async findAll() {
    return this.bookRepository.find({
      // Hangi ilişkili tabloları da getireyim?
      relations: ['addedBy', 'categories'],
      // Hangi sıraya göre? (En son eklenen en üstte)
      order: { createdAt: 'DESC' },
    });
  }

  // TEK BİR KİTABI GETİR (ID ile)
  async findOne(id: number) {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: ['addedBy', 'categories'],
    });

    if (!book) {
      // Eğer kitap yoksa hata fırlatmak güzel olur ama şimdilik null dönelim
      return null;
    }
    return book;
  }
  async update(id: number, updateBookDto: any) {
    // DTO tipini any yapabiliriz veya UpdateBookDto import edebilirsin

    // 1. Kategoriler güncellenecek mi?
    let categories = undefined;
    if (updateBookDto.categoryIds) {
      // Eğer yeni kategori ID'leri geldiyse, onları nesneye çevir
      categories = updateBookDto.categoryIds.map((catId) => ({ id: catId }));
    }

    // 2. Preload: Eski veriyle yeniyi harmanla
    // id'yi veriyoruz, değişen alanları (updateBookDto) veriyoruz.
    // categories varsa onu da ekliyoruz.
    const book = await this.bookRepository.preload({
      id: id,
      ...updateBookDto,
      categories: categories, // Eğer undefined ise burayı hiç ellemez, eskisi kalır
    });

    if (!book) {
      throw new Error(`Book #${id} not found`);
    }

    return this.bookRepository.save(book);
  }

  // 🗑️ KİTAP SİLME
  async remove(id: number) {
    const book = await this.findOne(id); // Önce var mı diye bak
    if (!book) {
      throw new Error('Kitap bulunamadı');
    }
    return this.bookRepository.remove(book);
  }
}

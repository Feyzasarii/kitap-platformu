import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto'; // Bunu eklemeyi unutma
import { User } from '../user/entities/user.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  // 🟢 KAYDETME (CREATE)
  async create(createBookDto: CreateBookDto, user?: User) {
    // Eski yöntemdeki gibi tek tek eşlemeye gerek yok.
    // DTO ile Entity alanları artık birebir uyumlu (title, imageUrl, categories vb.)

    const newBook = this.bookRepository.create({
      ...createBookDto, // DTO'daki her şeyi (categories dahil) otomatik al
      addedBy: user, // Kullanıcıyı ekle
    });

    return this.bookRepository.save(newBook);
  }

  // 🔵 LİSTELEME (FIND ALL)
  async findAll() {
    return this.bookRepository.find({
      relations: ['categories', 'addedBy'], // 👈 ÖNEMLİ: Kategorileri ve Ekleyeni getir
      order: { id: 'DESC' }, // En son eklenen en üstte
    });
  }

  // 🔵 TEK GETİR (FIND ONE)
  async findOne(id: number) {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: ['categories', 'addedBy'], // Detayda da kategoriler lazım
    });

    if (!book) {
      return null;
    }
    return book;
  }

  // 🟠 GÜNCELLEME (UPDATE)
  async update(id: number, updateBookDto: UpdateBookDto) {
    // Preload: TypeORM'un harika bir özelliği.
    // Eski veriyi veritabanından bulur, yenisiyle birleştirir.
    const book = await this.bookRepository.preload({
      id: id,
      ...updateBookDto, // Kategoriler dahil her şeyi günceller
    });

    if (!book) {
      throw new NotFoundException(`Kitap #${id} bulunamadı`);
    }

    return this.bookRepository.save(book);
  }

  // 🔴 SİLME (REMOVE)
  async remove(id: number) {
    const result = await this.bookRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Silinecek kitap (ID: ${id}) bulunamadı.`);
    }
    return { deleted: true };
  }
}

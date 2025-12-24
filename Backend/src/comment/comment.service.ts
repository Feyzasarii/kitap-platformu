import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { Book } from '../book/entities/book.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async create(createCommentDto: CreateCommentDto, user: any) {
    // user tipini 'any' yapalım ki id/userId karmaşası olmasın

    // 1. Kitap var mı kontrolü
    const book = await this.bookRepository.findOne({
      where: { id: createCommentDto.bookId },
    });
    if (!book) {
      throw new NotFoundException('Yorum yapmak istediğiniz kitap bulunamadı.');
    }

    // 2. Yorum objesini oluştur
    const newComment = this.commentRepository.create({
      text: createCommentDto.text,
      score: createCommentDto.score,

      // 👇 DEĞİŞİKLİK BURADA:
      // Tüm objeyi vermek yerine sadece ID içeren bir referans veriyoruz.
      book: { id: book.id },

      // 👇 Kullanıcı için de aynısı.
      // req.user'dan gelen veride id veya userId olabilir, ikisini de kontrol edelim.
      user: { id: user.id || user.userId },
    });

    // 3. Kaydet
    return this.commentRepository.save(newComment);
  }

  // ... findAll metodu aynı kalıyor
  findAll() {
    return this.commentRepository.find({
      relations: ['user', 'book'],
      order: { createdAt: 'DESC' }, // Bonus: En yeni yorum en üstte görünsün
    });
  }
}

import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Book } from '../../book/entities/book.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  // ÇOKTAN ÇOKA İLİŞKİ
  // (Burada @JoinTable kullanmıyoruz, sadece karşı tarafı gösteriyoruz)
  @ManyToMany(() => Book, (book) => book.categories)
  books: Book[];
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Category } from '../../category/entities/category.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  // 👇 Değişiklikler Burada: TypeScript için ? ekliyoruz
  @Column({ type: 'text', nullable: true })
  description?: string; // ? koyduk

  @Column({ nullable: true })
  pageCount?: number; // ? koyduk

  @Column({ nullable: true })
  publisher?: string; // ? koyduk

  @Column({ nullable: true })
  coverImage?: string; // ? koyduk

  // 1. İLİŞKİ: Kitabı ekleyen kullanıcı (Bu hala One-to-Many)
  // Bir kitabın sadece bir "ekleyeni" (sahibi) olur.
  @ManyToOne(() => User, (user) => user.books)
  addedBy: User;

  // 2. İLİŞKİ: Kategoriler (Many-to-Many) 👈 DEĞİŞEN KISIM
  // Bir kitap "Dizi" halinde kategorilere sahip olabilir.
  @ManyToMany(() => Category, (category) => category.books)
  @JoinTable({ name: 'book_category' }) // 👈 Tablo adı artık 'book_category' olacak
  categories: Category[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany, // 👈 1. Bunu buraya virgül koyarak ekle
  JoinColumn,
} from 'typeorm';
import { Role } from '../../role/entities/role.entity';
import { Book } from '../../book/entities/book.entity'; // 👈 2. Book Entity'i import et
import { Comment } from '../../comment/entities/comment.entity'; // 👈 Import et
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  passwordHash: string;

  @Column({ default: true })
  isActive: boolean;

  // --- ROL İLİŞKİSİ (Senin yazdığın kısım) ---
  @ManyToOne(() => Role, { eager: true })
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @Column()
  roleId: number;

  // --- KİTAP İLİŞKİSİ (Yeni eklediğimiz kısım) ---
  // Bir kullanıcının eklediği BİRÇOK kitap olabilir.
  @OneToMany(() => Book, (book) => book.addedBy)
  books: Book[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}

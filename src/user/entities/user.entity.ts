// src/user/entities/user.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from '../../role/entities/role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true }) // Kullanıcı adı benzersiz ve zorunlu
  username: string;

  @Column()
  passwordHash: string;

  @Column({ default: true })
  isActive: boolean;

  // --- Rol İlişkisi (Detaylı Versiyon) ---
  // TypeORM'in kullanacağı ilişki nesnesi
  @ManyToOne(() => Role, { eager: true })
  @JoinColumn({ name: 'roleId' }) // Foreign Key'i 'roleId' alanına bağla
  role: Role;

  @Column()
  roleId: number; // 👈 Foreign Key Sütunu (Veritabanındaki sayısal bağlantı)
}

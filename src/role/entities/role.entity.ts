// src/role/entities/role.entity.ts

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity() // Bu sınıfın bir veritabanı tablosunu temsil ettiğini belirtir
export class Role {
  @PrimaryGeneratedColumn()
  id: number; // Otomatik artan anahtar

  @Column({ unique: true }) // Veritabanında bu alanın benzersiz (unique) olmasını sağlar
  name: string; // Rol adı (Örn: 'admin', 'user')

  @Column({ default: true }) // Varsayılan değerini true olarak ayarlar
  isActive: boolean; // Rolün aktif olup olmadığını gösterir
}

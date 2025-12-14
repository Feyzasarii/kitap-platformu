// src/app.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // Docker konteynerine bilgisayarımızdan bağlanıyoruz
      port: 5432, // PostgreSQL'in varsayılan portu
      username: 'postgres', // Varsayılan kullanıcı adı
      password: '123456789', // Sizin belirlediğiniz şifre
      database: 'kitap_platformu_db', // Yeni oluşturacağımız veritabanı adı
      synchronize: true, // Geliştirme aşamasında Entity'leri otomatik senkronize eder (Prod. ortamında false olmalı!)
      autoLoadEntities: true, // Entity dosyalarını otomatik yükle
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

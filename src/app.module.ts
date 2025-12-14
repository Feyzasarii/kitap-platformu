// src/app.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';

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
    RoleModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

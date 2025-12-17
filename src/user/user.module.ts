// src/user/user.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // 👈 Bunu eklediğinizden emin olun
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity'; // 👈 Entity'yi import edin

@Module({
  imports: [TypeOrmModule.forFeature([User])], // 👈 Bu satır CRİTİK
  controllers: [UserController],
  providers: [UserService],
  // 👇 İŞTE EKSİK OLAN KISIM BURASIYDI 👇
  // UserService'i dışarıya açıyoruz ki AuthModule onu kullanabilsin.
  exports: [UserService],
})
export class UserModule {}

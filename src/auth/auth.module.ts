// src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module'; // UserService'i kullanmak için

@Module({
  imports: [
    UserModule, // UserService'i inject edebilmek için
    PassportModule,
    JwtModule.register({
      // 💡 ÖNEMLİ: Gerçek projede bunu .env dosyasında saklayın
      secret: 'SECRET_KEY_COK_GIZLI_VEYA_UZUN_OLMALI',
      signOptions: { expiresIn: '60m' }, // Token süresi 60 dakika
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

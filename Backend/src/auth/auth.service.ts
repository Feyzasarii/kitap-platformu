// src/auth/auth.service.ts

import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService, // UserService'i enjekte et
    private jwtService: JwtService, // JWT servisini enjekte et
  ) {}

  // 1. Kullanıcıyı Doğrulama (Giriş Kontrolü)
  async validateUser(identifier: string, pass: string): Promise<User> {
    const user = await this.userService.findOneByUsernameOrEmail(identifier);

    if (!user) {
      throw new UnauthorizedException('Kullanıcı adı veya e-posta hatalı.');
    }

    // Şifre kontrolü
    const isPasswordValid = await this.userService.validatePassword(
      pass,
      user.passwordHash,
    );

    if (user && isPasswordValid) {
      // Doğrulama başarılıysa kullanıcı nesnesini geri döndür
      return user;
    }
    throw new UnauthorizedException('Şifre hatalı.');
  }

  // 2. Başarılı Girişte JWT Token Üretme
  async login(user: User) {
    // JWT Payload (token içine koyacağımız veriler)
    const payload = {
      username: user.username,
      sub: user.id, // 'sub' (subject) standart JWT alanı, user ID'si
      role: user.role.name, // Kullanıcının rolünü token'a ekle
    };

    // Frontend'e gönderilecek veri yapısı
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role.name,
      },
    };
  }

  // 3. Kayıt Olma
  async register(email: string, username: string, passwordPlain: string) {
    if (!email || !username || !passwordPlain) {
      throw new BadRequestException('Tüm alanlar zorunludur.');
    }
    // UserService'deki kayıt metodunu kullan
    const newUser = await this.userService.registerUser(
      email,
      username,
      passwordPlain,
    );

    // Kayıttan sonra otomatik giriş yapıp token döndür
    return this.login(newUser);
  }
}

// src/user/user.service.ts

import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

// Not: CreateUserDto ve UpdateUserDto importlarını sildik çünkü
// şu an doğrudan parametreler (email, username, password) ile çalışacağız.
// İleride API'yi geliştirirken DTO'ları tekrar dahil ederiz.

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // 1. Yeni Kullanıcı Kaydetme Metodu (Eski 'create' yerine bunu kullanacağız)
  // src/user/user.service.ts içindeki registerUser metodu

  async registerUser(
    email: string,
    username: string,
    passwordPlain: string,
  ): Promise<User> {
    // 1. Kullanıcı var mı kontrol et
    const existingUser = await this.usersRepository.findOne({
      where: [{ email }, { username }],
    });

    if (existingUser) {
      throw new BadRequestException(
        'Bu e-posta veya kullanıcı adı zaten kullanımda.',
      );
    }

    // 2. Şifreyi hashle
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(passwordPlain, salt);

    // 3. Kullanıcıyı oluştur
    const newUser = this.usersRepository.create({
      email,
      username,
      passwordHash,
      roleId: 2, // Varsayılan user rolü
    });

    // 4. Veritabanına kaydet (Burada savedUser'ı tanımlıyoruz)
    const savedUser = await this.usersRepository.save(newUser);

    // 5. İlişkisiyle beraber geri çek
    const userWithRole = await this.usersRepository.findOne({
      where: { id: savedUser.id },
      relations: ['role'],
    });

    // 6. Eğer bir aksilik olur da kullanıcı bulunamazsa (ki imkansız ama TS ister)
    // hata fırlatıyoruz, böylece return tipi her zaman 'User' kalıyor.
    if (!userWithRole) {
      throw new BadRequestException(
        'Kullanıcı oluşturuldu fakat rolü yüklenemedi.',
      );
    }

    return userWithRole;
  }
  // 2. Kullanıcı Adı veya E-posta ile Kullanıcı Bulma (Login işlemi için)
  async findOneByUsernameOrEmail(identifier: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: [{ email: identifier }, { username: identifier }],
      relations: ['role'], // Rol bilgisini de çekiyoruz
    });
  }

  // 3. Şifre Doğrulama Metodu
  async validatePassword(
    passwordPlain: string,
    passwordHash: string,
  ): Promise<boolean> {
    return bcrypt.compare(passwordPlain, passwordHash);
  }
}

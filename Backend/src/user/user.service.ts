import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // 1. Yeni Kullanıcı Kaydı
  async registerUser(
    email: string,
    username: string,
    passwordPlain: string,
  ): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: [{ email }, { username }],
    });

    if (existingUser) {
      throw new BadRequestException(
        'Bu e-posta veya kullanıcı adı zaten kullanımda.',
      );
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(passwordPlain, salt);

    const newUser = this.usersRepository.create({
      email,
      username,
      passwordHash,
      roleId: 2, // Varsayılan: User
    });

    const savedUser = await this.usersRepository.save(newUser);

    const userWithRole = await this.usersRepository.findOne({
      where: { id: savedUser.id },
      relations: ['role'],
    });

    if (!userWithRole) {
      throw new BadRequestException(
        'Kullanıcı oluşturuldu fakat rolü yüklenemedi.',
      );
    }

    return userWithRole;
  }

  // 2. Login İçin Kullanıcı Bulma
  async findOneByUsernameOrEmail(identifier: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: [{ email: identifier }, { username: identifier }],
      relations: ['role'],
    });
  }

  // 3. Şifre Doğrulama
  async validatePassword(
    passwordPlain: string,
    passwordHash: string,
  ): Promise<boolean> {
    return bcrypt.compare(passwordPlain, passwordHash);
  }

  // 4. Profil Sayfası İçin ID ile Bulma
  async findOneById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['role'], // Profilde rol ismini görmek için şart!
    });
  }
}

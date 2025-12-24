// src/auth/dto/login.dto.ts

import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Kullanıcı adı veya e-posta gereklidir.' })
  @IsString()
  identifier: string; // Kullanıcı adı veya Email olabilir

  @IsNotEmpty({ message: 'Şifre gereklidir.' })
  password: string;
}

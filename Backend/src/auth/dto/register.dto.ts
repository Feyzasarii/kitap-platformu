// src/auth/dto/register.dto.ts

import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Geçerli bir e-posta adresi giriniz.' })
  email: string;

  @IsNotEmpty({ message: 'Kullanıcı adı boş bırakılamaz.' })
  @IsString()
  username: string;

  @IsNotEmpty({ message: 'Şifre boş bırakılamaz.' })
  @MinLength(6, { message: 'Şifre en az 6 karakter olmalıdır.' }) // 8'den 6'ya düşürdük
  @IsString()
  password: string;
}

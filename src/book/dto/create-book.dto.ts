import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
  IsUrl,
} from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  author: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  pageCount?: number;

  @IsOptional()
  @IsString()
  publisher?: string;

  @IsOptional()
  @IsUrl() // Basit bir URL kontrolü
  coverImage?: string;

  // En Önemli Kısım: Kategoriler
  // Kullanıcı bize [1, 2, 5] gibi ID listesi gönderecek
  @IsArray()
  @IsNumber({}, { each: true }) // Listenin içindeki her şey sayı olmalı
  categoryIds: number[];
}

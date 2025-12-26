import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
} from 'class-validator';
import { Category } from '../../category/entities/category.entity';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  author: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  pageCount?: number;

  @IsOptional()
  @IsString()
  publisher?: string;

  @IsOptional()
  @IsNumber()
  publishYear?: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  // 👇 KRİTİK NOKTA: Kategorileri nesne dizisi olarak bekleyeceğiz
  // Örn: [{id: 1}, {id: 3}]
  @IsOptional()
  @IsArray()
  categories?: Category[];
}

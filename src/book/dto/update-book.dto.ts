import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create-book.dto';
// PartialType: CreateBookDto içindeki her şeyi alır ama hepsini "opsiyonel" yapar.
// Yani güncelleme yaparken sadece "title" gönderebilirsin, diğerlerini göndermene gerek kalmaz.
export class UpdateBookDto extends PartialType(CreateBookDto) {}

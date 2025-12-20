import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsInt()
  bookId: number; // Hangi kitap?

  @IsNotEmpty()
  @IsString()
  text: string; // Yorum metni

  @IsNotEmpty()
  @IsInt()
  @Min(1) // En az 1 yıldız
  @Max(5) // En çok 5 yıldız
  score: number;
}

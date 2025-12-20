import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity'; // 👈
import { Book } from '../book/entities/book.entity'; // 👈 1. Import et

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Book])], // 👈 2. Book'u buraya ekle
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}

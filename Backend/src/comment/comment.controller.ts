import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('comment')
@UseInterceptors(ClassSerializerInterceptor) // 👈 3. Bu satırı ekle (Sihir burada!)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(JwtAuthGuard) // 🔒 Sadece giriş yapanlar
  create(@Body() createCommentDto: CreateCommentDto, @Req() req) {
    // req.user, JWT'den gelen kullanıcı bilgisidir
    return this.commentService.create(createCommentDto, req.user);
  }

  @Get()
  findAll() {
    return this.commentService.findAll();
  }
}

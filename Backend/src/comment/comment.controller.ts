import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Delete,
  Param,
  Put, // 👈 Yorum güncelleme için eklendi
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard'; // 👈 Yol kontrolü yapıldı
import { Roles } from '../auth/decorators/roles.decorator'; // 👈 Yol kontrolü yapıldı

@Controller('comment')
@UseInterceptors(ClassSerializerInterceptor)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // 1. Yeni Yorum Oluştur
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createCommentDto: CreateCommentDto, @Req() req) {
    // req.user bilgisini JWTGuard otomatik olarak doldurur
    return this.commentService.create(createCommentDto, req.user);
  }

  // 2. Profil Sayfası İçin: Sadece Giriş Yapan Kullanıcının Yorumları
  @Get('my-reviews')
  @UseGuards(JwtAuthGuard)
  findMyReviews(@Req() req) {
    // req.user içindeki ID'yi (id veya userId olabilir) servise gönderiyoruz
    const userId = req.user.id || req.user.userId;
    return this.commentService.findMyReviews(userId);
  }

  // 3. Ana Sayfa Akışı İçin: Tüm Yorumları Getir
  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  // 4. Yorum Güncelleme (Kullanıcının kendi yorumunu düzenlemesi için)
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Req() req, @Body() updateDto: any) {
    // Kullanıcının sadece kendi yorumunu güncellediğinden emin olmak için req.user.id gönderilir
    return this.commentService.update(+id, req.user.id, updateDto);
  }

  // 5. Admin İçin: Yorum Silme (Moderasyon)
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin') // 🔒 Sadece 'admin' rolüne sahip olanlar silebilir
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}

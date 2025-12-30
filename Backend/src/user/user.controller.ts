import {
  Controller,
  Get,
  UseGuards,
  Req,
  NotFoundException,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service'; // 👈 Kırmızı hata buradan kalkacak
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('user') // 👈 404 hatasını çözen kritik satır (tekil 'user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    // JWT Payload yapısına göre id veya userId gelebilir, ikisini de kontrol ediyoruz
    const id = req.user.id || req.user.userId;

    if (!id) {
      throw new NotFoundException('Kullanıcı kimlik bilgisi doğrulanamadı.');
    }

    const user = await this.userService.findOneById(id);

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    // Hassas verileri (passwordHash gibi) ayıklayıp sadece gerekli bilgileri dönüyoruz
    const { passwordHash, ...result } = user as any;
    return result;
  }

  @Get('admin-panel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getAdminData() {
    return { mesaj: 'Tebrikler Admin! Gizli verilere ulaştın.' };
  }
}

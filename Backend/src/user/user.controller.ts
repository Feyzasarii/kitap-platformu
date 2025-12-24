import {
  Controller,
  Get,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // 👈 Yeni Guard'ımız
import { UserService } from './user.service';
import { Roles } from '../auth/decorators/roles.decorator'; // 👈 Etiketimiz
import { RolesGuard } from '../auth/guards/roles.guard'; // 👈 Yeni bekçimiz

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // src/user/user.controller.ts içindeki getProfile metodu

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    const user = await this.userService.findOneById(req.user.userId);

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    // 👇 Burada password değil, passwordHash yazmalısın (Entity'deki isme göre)
    const { passwordHash, ...result } = user;
    return result;
  }
  @Get('admin-panel')
  @UseGuards(JwtAuthGuard, RolesGuard) // 👈 Önce giriş yapmalı, sonra Admin olmalı!
  @Roles('admin') // 👈 Bu kapıyı sadece 'admin' olanlar açabilir
  async getAdminData() {
    return { mesaj: 'Tebrikler Admin! Gizli verilere ulaştın.' };
  }
}

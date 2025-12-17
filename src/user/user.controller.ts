// src/user/user.controller.ts

import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Şimdilik buradaki eski metodları (create, update, remove) SİLİYORUZ.
  // Çünkü UserService'te bunların karşılığı kalmadı.

  // Sadece test amaçlı basit bir metod bırakalım:
  @Get()
  getHello() {
    return 'User controller çalışıyor, ancak şu an boş.';
  }
}

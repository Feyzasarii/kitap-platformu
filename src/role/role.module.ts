// src/role/role.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // 👈 Bunu eklediğinizden emin olun
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { Role } from './entities/role.entity'; // 👈 Entity'yi import edin

@Module({
  imports: [TypeOrmModule.forFeature([Role])], // 👈 Bu satır CRİTİK
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}

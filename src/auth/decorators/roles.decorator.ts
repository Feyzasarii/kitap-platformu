import { SetMetadata } from '@nestjs/common';

// Bu etiket ile rotalara hangi rollerin girebileceğini yazacağız
// Örnek: @Roles('admin')
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

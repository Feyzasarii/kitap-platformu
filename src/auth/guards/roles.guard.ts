import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Rota üzerinde belirlenen rolleri oku (@Roles('admin') gibi)
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // Eğer bir rol belirlenmemişse herkes girebilir (kilit yok)
    }

    // 2. İstek atan kullanıcının rolünü al (AuthGuard'dan geliyor)
    const { user } = context.switchToHttp().getRequest();

    // 3. Kullanıcının rolü, gereken rollerden birine sahip mi?
    return requiredRoles.some((role) => user.role?.includes(role));
  }
}

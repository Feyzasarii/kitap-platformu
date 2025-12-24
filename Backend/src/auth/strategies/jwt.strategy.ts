import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // 1. İsteklerin başlığından (Authorization Header) Bearer Token'ı çıkar
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 2. Token süresi dolmuşsa isteği reddet
      ignoreExpiration: false,
      // 3. Dün AuthModule'de belirlediğimiz gizli anahtar (Aynı olmalı!)
      secretOrKey: 'benim-cok-gizli-mühürüm-123',
    });
  }

  // Token geçerliyse, içindeki veriyi (payload) buraya getirir
  async validate(payload: any) {
    // Buradan dönen veri, "req.user" olarak diğer controller'larda erişilebilir olur
    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}

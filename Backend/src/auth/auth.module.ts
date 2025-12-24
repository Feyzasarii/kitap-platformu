import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy'; // 👈 Bunu ekledik

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: 'benim-cok-gizli-mühürüm-123',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // 👈 JwtStrategy'yi buraya ekledik
  exports: [AuthService],
})
export class AuthModule {}

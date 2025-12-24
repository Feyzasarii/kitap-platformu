// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // 👈 Bunu ekle

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 👇 BU SATIRI EKLE (Frontend ile konuşabilmek için şart)
  app.enableCors();

  // 👈 Bu satırı ekle: Gelen verileri DTO'lardaki kurallara göre denetler.
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

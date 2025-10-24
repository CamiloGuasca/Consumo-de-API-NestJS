import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true, // convierte strings de query a number, etc.
  }));
  await app.listen(5000);
  console.log('🚀 API lista en http://localhost:5000');
}
bootstrap();

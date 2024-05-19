import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { TransformInterceptor } from './interceptors/transform.interceptor';
const port = 3001

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api')
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalInterceptors(new TransformInterceptor())
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true
  });
  await app.listen(port);
}
bootstrap();

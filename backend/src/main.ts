import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
const cookieParser = require('cookie-parser');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const frontendUrls = (process.env.FRONTEND_URL || 'http://localhost:3000')
    .split(',')
    .map((item) => item.trim());

  app.enableCors({
    origin: frontendUrls,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.use(cookieParser());

  const uploadDir = process.env.UPLOAD_DIR || 'uploads';
  const absoluteUploadDir = join(process.cwd(), uploadDir);

  if (!existsSync(absoluteUploadDir)) {
    mkdirSync(absoluteUploadDir, { recursive: true });
  }

  app.useStaticAssets(absoluteUploadDir, { prefix: '/uploads/' });

  await app.listen(process.env.PORT || 3001);
}

bootstrap();

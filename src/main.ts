import { NestFactory } from '@nestjs/core';
import {  ValidationPipe, VersioningType } from '@nestjs/common';
import { AppModuleV1 } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModuleV1, {
    logger: ['error', 'warn', 'debug', 'log', 'fatal', 'verbose']
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.enableCors();
  await app.listen(process.env.PORT);
}
bootstrap();

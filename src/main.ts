import { NestFactory } from '@nestjs/core';
import {  ValidationPipe, VersioningType } from '@nestjs/common';
import { AppModuleV1 } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  const config = new DocumentBuilder()
    .setTitle('Median')
    .setDescription('The Median API description')
    .setVersion('0.1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT);
}
bootstrap();

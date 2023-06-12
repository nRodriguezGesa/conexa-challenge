import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { BussinessModule } from './modules/bussiness.module';

async function bootstrap() {
  const port = 3001;
  const globalPrefix = 'conexa-challenge';
  const baseUrl = 'http://localhost:3001/';
  const swaggerOptions = new DocumentBuilder()
    .setTitle('Bussiness')
    .setDescription('Conexa Challenge Bussiness module')
    .setVersion('1.0')
    .addTag('Bussiness')
    .addBearerAuth(
      {
        description: 'Please enter token in following format: Bearer <JWT>',
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'access-token',
    )
    .build();
  const app = await NestFactory.create(BussinessModule, {
    logger: ['error', 'log'],
  });
  app.enableCors({
    methods: ['GET'],
    origin: 'http://localhost:3000/',
  });
  app.setGlobalPrefix(globalPrefix);
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptions);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  SwaggerModule.setup(`${globalPrefix}/docs`, app, swaggerDocument);
  await app.listen(port);
  Logger.log(`Listen to port: ${port}`, 'App');
  Logger.log(`Docs: ${baseUrl}${globalPrefix}/docs`, 'App');
}
bootstrap();

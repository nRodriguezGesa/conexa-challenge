import { NestFactory } from '@nestjs/core';
import { LoginModule } from './modules/login.module';
import helmet from 'helmet';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AllExceptionsFilter } from './utils/all.exception.filter';

async function bootstrap() {
  const port = 3000;
  const globalPrefix = 'conexa-challenge';
  const baseUrl = 'http://localhost:3000/';
  const swaggerOptions = new DocumentBuilder()
    .setTitle('Login')
    .setDescription('Conexa Challenge Login module')
    .setVersion('1.0')
    .addTag('Login')
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
  const app = await NestFactory.create(LoginModule, {
    cors: true,
    logger: ['error', 'log'],
  });
  app.useGlobalFilters(new AllExceptionsFilter());
  app.setGlobalPrefix(globalPrefix);
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptions);
  app.use(helmet());
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

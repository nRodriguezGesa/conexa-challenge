import { NestFactory } from '@nestjs/core';
import { LoginModule } from './modules/login.module';
import helmet from 'helmet';
import * as express from 'express';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as functions from 'firebase-functions';
import * as dotenv from 'dotenv';

const expressServer = express();

async function bootstrap() {
  dotenv.config();
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
  const app = await NestFactory.create(
    LoginModule,
    new ExpressAdapter(expressServer),
    {
      logger: ['error', 'log'],
    },
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.setGlobalPrefix(globalPrefix);
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptions);
  app.use(helmet());

  SwaggerModule.setup(`${globalPrefix}/docs`, app, swaggerDocument);
  if (process.env.NODE_ENV === 'local') {
    await app.listen(port);
    Logger.log(`Listen to port: ${port}`, 'App');
    Logger.log(`Docs: ${baseUrl}${globalPrefix}/docs`, 'App');
  } else {
    await app.init();
  }
}
bootstrap();

export const api = functions.https.onRequest(expressServer);

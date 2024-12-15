import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { requestContextMiddleware } from '@medibloc/nestjs-request-context';
import { MyRequestContext } from './utilities/request-context.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import {
  HttpStatus,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { ValidationError, useContainer } from 'class-validator';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import * as expressBasicAuth from 'express-basic-auth';

function getObject(theObject) {
  let result = null;
  if (theObject instanceof Array) {
    for (let i = 0; i < theObject.length; i++) {
      result = getObject(theObject[i]);
      if (result) {
        break;
      }
    }
  } else {
    for (const prop in theObject) {
      if (prop == 'constraints') {
        return theObject.constraints;
      }
      if (
        theObject[prop] instanceof Object ||
        theObject[prop] instanceof Array
      ) {
        result = getObject(theObject[prop]);
        if (result) {
          break;
        }
      }
    }
  }
  return result;
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    }),
  );

  app.use(requestContextMiddleware(MyRequestContext));

  app.set('trust proxy', true);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const constraints = getObject(validationErrors);
        if (!constraints) {
          return new UnprocessableEntityException({
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            message: 'constraints error',
          });
        }
        return new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          message: constraints[Object.keys(constraints)[0]],
        });
      },
    }),
  );

  app.setGlobalPrefix('api/v1');

  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  const SWAGGER_PATH = '/docs';
  const SWAGGER_PASS = app.get(ConfigService).get('SWAGGER_PASSWORD');

  if (process.env.NODE_ENV !== 'development') {
    app.use(
      [`${SWAGGER_PATH}`, `${SWAGGER_PATH}-json`],
      expressBasicAuth({
        challenge: true,
        users: {
          admin: SWAGGER_PASS,
        },
      }),
    );
  }

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('Shop Now Now API DOCUMENTATIONS')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${SWAGGER_PATH}`, app, document);

  app.enableCors();

  await app.listen(process.env.PORT);
}
bootstrap();

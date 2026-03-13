import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { SwaggerModule } from '@nestjs/swagger';
import { config } from 'config/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new PinoLogger({
    pinoHttp: {},
    renameContext: 'nestContext',
  });

  /// findone بتاعت الداشبورد وعمل migrate ++ createdAt in schema

  app.use(helmet(), hpp(), cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  const Doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, Doc);
  logger.info(`server is running... on 3000`);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

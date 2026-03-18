import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bullmq';
import { LoggerModule } from 'nestjs-pino';
import { resolve } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CommonModule,
  GlobalErrFilter,
  ResponseInterceptor,
  TimeoutInterceptor,
  UserRepository,
} from './common';
import {
  EmailModule,
  redis,
  rejectedApplicationsModule,
} from './common/Utils/services/index';
import {
  AccountModule,
  AuthModule,
  CompanyModule,
  DashboardModule,
  JobCatModule,
  ProfileModule,
  WorkTypeModule,
  JobModule,
  SavedJobModule,
  ApplicationModule,
  ReportModule,
  AIModule,
  NotificationModule,
} from './modules';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: resolve('config/dev.env'),
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI_MONGO as string, {
      serverSelectionTimeoutMS: 30000,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 30,
        limit: 2000,
      },
    ]),
    BullModule.forRoot({
      connection: redis,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: 'debug',
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
          },
        },
      },
    }),
    EmailModule,
    rejectedApplicationsModule,
    CommonModule,
    PrismaModule,
    AuthModule,
    ProfileModule,
    AccountModule,
    CompanyModule,
    WorkTypeModule,
    DashboardModule,
    JobModule,
    JobCatModule,
    SavedJobModule,
    ApplicationModule,
    AIModule,
    ReportModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UserRepository,
    { provide: 'APP_INTERCEPTOR', useClass: ResponseInterceptor },
    { provide: 'APP_INTERCEPTOR', useClass: TimeoutInterceptor },
    { provide: 'APP_FILTER', useClass: GlobalErrFilter },
    { provide: 'APP_GUARD', useClass: ThrottlerGuard },
  ],
})
export class AppModule {}

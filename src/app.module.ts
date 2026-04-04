import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import {  ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bullmq';
import { LoggerModule } from 'nestjs-pino';
import { join, resolve } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
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
  GatewayModule,
  ChatModule,
} from './modules';
import { PrismaModule } from './prisma/prisma.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GraphQLModule } from '@nestjs/graphql';
import { GqlThrottlerGuard } from './common/guards';

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
        ttl: 30000,
        limit: 2000,
      },
    ]),
    BullModule.forRoot({connection: redis
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
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      context: ({ req, res }) => ({ req, res }),
    }),
    EventEmitterModule.forRoot(),
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
    GatewayModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UserRepository,
    { provide: 'APP_INTERCEPTOR', useClass: ResponseInterceptor },
    { provide: 'APP_INTERCEPTOR', useClass: TimeoutInterceptor },
    { provide: 'APP_FILTER', useClass: GlobalErrFilter },
    { provide: 'APP_GUARD', useClass: GqlThrottlerGuard },
  ],
})
export class AppModule {}

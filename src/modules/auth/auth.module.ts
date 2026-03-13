import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CompanyRepository,
  CryptoService,
  EmailModule,
  HashingService,
  MailModule,
  UserRepository,
} from 'src/common';
import { AuthController } from './auth.controller';

@Module({
  providers: [
    AuthService,
    UserRepository,
    CryptoService,
    HashingService,
    CompanyRepository,
  ],
  controllers: [AuthController],
  imports: [MailModule, EmailModule],
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import {
  EmailModule,
  HashingService,
  s3_services,
  UserRepository,
} from 'src/common';
import { AccountController } from './account.controller';
import { AccountServices } from './account.service';

@Module({
  imports: [EmailModule],
  providers: [AccountServices, UserRepository, HashingService, s3_services],
  controllers: [AccountController],
  exports: [],
})
export class AccountModule {}

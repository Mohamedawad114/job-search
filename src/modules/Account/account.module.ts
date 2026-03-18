import { Module } from '@nestjs/common';
import { HashingService, UserRepository } from 'src/common';
import { EmailModule, s3_services } from 'src/common/Utils/services/index';
import { AccountController } from './account.controller';
import { AccountServices } from './account.service';

@Module({
  imports: [EmailModule],
  providers: [AccountServices, UserRepository, HashingService, s3_services],
  controllers: [AccountController],
  exports: [],
})
export class AccountModule {}

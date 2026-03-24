import { Module } from '@nestjs/common';
import { Gateway } from './gateway';
import { UserRepository } from 'src/common/Repositories';

@Module({
  imports: [],
  exports: [Gateway],
  providers: [Gateway, UserRepository],
})
export class GatewayModule {}

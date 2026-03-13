import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { CompanyRepository } from 'src/common/Repositories';
import { MapsProducer } from './maps.producer';
import { MapsWorker } from './maps.processor';
import { MapsModule } from '../../maps/maps.module';

@Module({
  imports: [BullModule.registerQueue({ name: 'maps' }),MapsModule],
  providers: [ CompanyRepository,MapsProducer,MapsWorker],
  exports: [MapsProducer],
})
export class MapsJobModule {}

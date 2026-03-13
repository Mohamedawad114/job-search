import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class MapsProducer {
  constructor(@InjectQueue('maps') private readonly mapsQueue: Queue) {}
  addressToMaps = async (address: string, companyId: number) => {
    await this.mapsQueue.add(
      'mapAddress',
      {
        companyId,
        address,
      },
      {
        attempts: 3,
        removeOnFail: false,
        removeOnComplete: true,
      },
    );
  };
}

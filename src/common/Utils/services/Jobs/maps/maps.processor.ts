import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PinoLogger } from 'nestjs-pino';
import { CompanyRepository } from 'src/common/Repositories';
import { MapService } from '../../maps/maps.service';

@Processor('maps')
export class MapsWorker extends WorkerHost {
  constructor(
    private readonly logger: PinoLogger,
    private readonly mapsService: MapService,
    private readonly companyRepo: CompanyRepository,
  ) {
    super();
  }
  async process(job: Job): Promise<any> {
    const { address, companyId } = job.data;
    try {
      const { lat, lng, formattedAddress } =
        await this.mapsService.geocoding(address);
  
      const update = await this.companyRepo.findAndUpdate(companyId, {
        formatAddress: formattedAddress,
        latitude: lat,
        longitude: lng,
      });
      this.logger.info({ company: update }, 'Company updated with coordinates');
    } catch (err) {
      this.logger.error({ err }, 'Maps job failed');
      throw err;
    }
  }
  @OnWorkerEvent('completed')
  handleCompleted(job: Job) {
    this.logger.info(`Job ${job.id} completed successfully`);
  }

  @OnWorkerEvent('failed')
  handleFailed(job: Job, err: Error) {
    this.logger.error(`Job ${job.id} failed: ${err.message}`);
  }
}

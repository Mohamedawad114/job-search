import { Module } from '@nestjs/common';
import { ApplicationRepository, EmailModule, JobRepository } from 'src/common';
import { ApplicationService } from './application.service';

@Module({
    providers: [JobRepository, ApplicationRepository, ApplicationService],
    imports:[EmailModule],
  controllers: [],
})
export class ApplicationModule {}

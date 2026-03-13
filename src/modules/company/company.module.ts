import { Module } from '@nestjs/common';
import {
  CompanyRepository,
  JobRepository,
  MapsJobModule,
  s3_services,
  UserRepository,
  WorkTypeRepository,
} from 'src/common';
import { CompanyService } from './company.service';
import { AdminCompanyController } from './adminCompany.controller';
import { CompanyController } from './company.controller';

@Module({
  imports: [MapsJobModule],
  providers: [
    CompanyRepository,
    UserRepository,
    WorkTypeRepository,
    CompanyService,
    s3_services,
    JobRepository,
  ],
  controllers: [AdminCompanyController, CompanyController],
})
export class CompanyModule {}

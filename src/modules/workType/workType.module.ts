import { Module } from '@nestjs/common';
import { CompanyRepository, WorkTypeRepository } from 'src/common';
import { WorkTypeService } from './workType.service';
import { WorkTypeController } from './workType.controller';

@Module({
  imports: [],
  providers: [WorkTypeRepository, WorkTypeService, CompanyRepository],
  controllers: [WorkTypeController],
})
export class WorkTypeModule {}

import { PartialType } from '@nestjs/mapped-types';
import { CreateJobDto } from './create-job.dto';
import { IsArray, IsNumber, isNumber, IsOptional } from 'class-validator';

export class UpdateJobDto extends PartialType(CreateJobDto) {
  @IsArray({ each: true })
  @IsNumber({}, { each: true })
  @IsOptional()
  removedSkills?: number[];
}

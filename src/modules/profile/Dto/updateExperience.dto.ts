import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class UpdateExperienceDto {
  @IsOptional()
  @Type(() => Date)
  endDate: Date;
  @IsString()
  @IsOptional()
  position: string;
}

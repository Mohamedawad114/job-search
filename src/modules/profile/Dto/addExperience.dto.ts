import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { IExperience } from 'src/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddExperienceDto implements IExperience {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(5, 24)
  position: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(5, 12)
  company: string;

  @ApiProperty({ type: Date, example: '2024-01-01' })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiPropertyOptional({ type: Date, example: '2024-12-31' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  endDate?: Date;
}

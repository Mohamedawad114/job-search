import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';
import { degree } from 'src/common/Enum';
import { ApiProperty } from '@nestjs/swagger';

export class AddEducationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(3, 24)
  university: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(3, 24)
  college: string;

  @ApiProperty({ enum: degree })
  @IsEnum(degree)
  degree: degree;

  @ApiProperty({ type: Date, example: '2020-09-01' })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({ example: 2024 })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  graduationYear: number;
}

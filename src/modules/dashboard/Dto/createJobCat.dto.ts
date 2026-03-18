import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateJobCatDto {
  @ApiProperty()
  @IsString()
  @Length(4, 36)
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @Length(4, 100)
  @IsOptional()
  description: string;
}

import { IsArray, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class applicationStatus {
  @ApiProperty({ type: [Number] })
  @IsArray({ each: true })
  @IsNumber({})
  @IsPositive({ each: true })
  @IsNotEmpty()
  applyIds: number[];
}

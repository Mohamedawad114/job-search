import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeAdminCompany {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  userId: number;
}

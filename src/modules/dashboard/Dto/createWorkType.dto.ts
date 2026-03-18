import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWorkTypeDto {
  @ApiProperty()
  @IsString()
  @Length(4, 36)
  @IsNotEmpty()
  name: string;
}

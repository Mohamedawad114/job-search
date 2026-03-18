import { IsEnum } from 'class-validator';
import { File } from 'src/common/Enum';
import { ApiProperty } from '@nestjs/swagger';

export class uploadDto {
  @ApiProperty({ enum: File })
  @IsEnum(File)
  file: string;
}

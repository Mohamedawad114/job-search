import { IsEnum, IsNotEmpty } from 'class-validator';
import { JobStatus } from 'src/common/Enum';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeStatus {
  @ApiProperty({ enum: JobStatus })
  @IsEnum(JobStatus)
  @IsNotEmpty()
  status: JobStatus;
}

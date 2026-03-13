import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApplicationStatusEnum } from 'src/common';

export class applicationStatus {
  @IsEnum([ApplicationStatusEnum.ACCEPTED, ApplicationStatusEnum.REVIEWED])
  @IsNotEmpty()
  status: ApplicationStatusEnum;
}

import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUploadDto {
  @IsNotEmpty()
  @IsString()
  key: string;
}

import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateWorkTypeDto {
  @IsString()
  @Length(4, 36)
  @IsNotEmpty()
  name: string;
}

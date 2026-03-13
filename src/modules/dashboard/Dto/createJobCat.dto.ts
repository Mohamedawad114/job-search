import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateJobCatDto {
  @IsString()
  @Length(4, 36)
  @IsNotEmpty()
  name: string;
  @IsString()
  @Length(4, 100)
  @IsOptional()
  description: string;
}

import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateSkillDto {
  @IsString()
  @Length(2, 24)
  @IsNotEmpty()
  skill: string;
}

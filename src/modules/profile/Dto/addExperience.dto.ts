import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from "class-validator";
import { IExperience } from "src/common";

export class AddExperienceDto implements IExperience {
  @IsOptional()
  @IsNumber()
  userId: number;
  @IsString()
  @IsNotEmpty()
  @Length(5, 12)
  position: string;
  @IsString()
  @IsNotEmpty()
  @Length(5, 12)
  company: string;
  @IsDate()
  @Type(() => Date)
  startDate: Date;
    @IsDate()
      @IsOptional()
  @Type(() => Date)
  endDate?: Date;
}
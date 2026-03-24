import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';
import { Types } from 'mongoose';

export class MessageDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 1000)
  content: string;
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  targetId: number;
}
export class MessageGroupDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 1000)
  content: string;
  @IsMongoId()
  targetId: Types.ObjectId;
}

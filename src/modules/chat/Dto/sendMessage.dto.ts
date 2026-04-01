import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
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
export class ReadMessageDto {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  targetId: number;
}
export class GetHistoryDto {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  targetUserId: number;
  @IsNumber()
  @IsOptional()
  limit?: number;
  @IsString()
  cursor: string;
}
export class GetGroupHistoryDto {
@IsMongoId()
  targetGroupId: Types.ObjectId;
  @IsNumber()
  @IsOptional()
  limit?: number;
  @IsString()
  cursor: string;
}

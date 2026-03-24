import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { trusted } from 'mongoose';

export class CreateGroup {
  @IsArray()
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  memberIds: number[];
  @IsString()
  @IsNotEmpty()
  name: string;
}

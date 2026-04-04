import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsPositive } from 'class-validator';

@ArgsType()
export class JobDetailsArgs {
  @Field(() => Int)
  @IsNumber()
  @IsPositive()
  jobId: number;
}

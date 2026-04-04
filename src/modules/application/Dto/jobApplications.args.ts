import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

@ArgsType()
export class JobApplicationsArgs {
  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  jobId: number;
  @Field(() => Int, { defaultValue: 1 })
  @IsNumber()
  @IsOptional()
  page: number;
  @Field(() => Int, { defaultValue: 10 })
  @IsNumber()
  @IsOptional()
  limit: number;
}

import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { registerEnumType } from '@nestjs/graphql';
import {
  ApplicationStatusEnum,
  Gender,
  maritalStatus,
  MilitarySituation,
} from 'src/common';

registerEnumType(ApplicationStatusEnum, {
  name: 'ApplicationStatus',
});
registerEnumType(Gender, {
  name: 'Gender',
});
registerEnumType(MilitarySituation, {
  name: 'MilitarySituation',
});
registerEnumType(maritalStatus, {
  name: 'maritalStatus',
});

@ObjectType()
export class UserEntity {
  @Field(() => Int)
  id: number;
  @Field(() => String)
  name: string;
  @Field(() => String)
  email: string;
  @Field(() => String)
  phoneNumber: string;
  @Field(() => String, { nullable: true })
  profilePicture?: string;
  @Field(() => Gender)
  gender: Gender;
  @Field(() => maritalStatus)
  maritalStatus: maritalStatus;
  @Field(() => MilitarySituation, { nullable: true })
  MilitarySituation?: MilitarySituation;
  @Field(() => Int, { nullable: true })
  companyId?: number;
  @Field(() => String, { nullable: true })
  CV?: string;
  @Field(() => String, { nullable: true })
  bio?: string;
}
@ObjectType()
export class ApplicationEntity {
  @Field(() => Int)
  id: number;
  @Field(() => String)
  city: string;
  @Field(() => String)
  phone: string;
  @Field(() => Float)
  expectedSalary: number;
  @Field(() => Int)
  userId: number;
  @Field(() => Int)
  jobId: number;
  @Field(() => String)
  CV: string;
  @Field(() => ApplicationStatusEnum)
  status: ApplicationStatusEnum;
  @Field(() => Int)
  noticePeriod: number;
  @Field(() => UserEntity)
  user: UserEntity;
}
@ObjectType()
export class PaginationMeta {
  @Field(() => Int)
  total: number;
  @Field(() => Int)
  pages: number;
}
@ObjectType()
export class JobApplicationsResponse {
  @Field(() => [ApplicationEntity])
  data: ApplicationEntity[];
  @Field(() => PaginationMeta)
  meta: PaginationMeta;
}

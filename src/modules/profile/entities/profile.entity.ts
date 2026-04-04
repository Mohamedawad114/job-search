import { Field, Int, ObjectType, registerEnumType } from "@nestjs/graphql";
import { degree, Gender, IEducation, IExperience, maritalStatus, MilitarySituation, Sys_Role } from "src/common";
registerEnumType(degree, {name:'degree'})
@ObjectType()
export class educationEntity implements IEducation {
  @Field(() => Int)
  id: number;
  @Field(() => Int)
  userId: number;
  @Field(() => String)
  university: string;
  @Field(() => String)
  college: string;
  @Field(() => degree)
    degree: degree;
    @Field(() => Date)
    startDate: Date;
    @Field(() => Int)
  graduationYear: number;
}
@ObjectType()
export class ExperienceEntity implements IExperience {
    @Field(() => Int)
    id: number;
    @Field(() => Int)
    userId: number;
    @Field(() => String)
    company: string;
    @Field(() => String)
    position: string;
    @Field(() => Date)
    startDate: Date;
    @Field(() => Date)
    endDate: Date;
}
@ObjectType()
export class UserProfileEntity {
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
  @Field()
  dateBirth: Date;
  @Field(() => String, { nullable: true })
  bio?: string;
  @Field(() => [ExperienceEntity], { nullable: true })
  experiences?: ExperienceEntity[];
  @Field(() => educationEntity, { nullable: true })
  education?: educationEntity;
}

import {
  Field,
  ObjectType,
  registerEnumType,
  Int,
  Float,
} from '@nestjs/graphql';
import { ICompany, IJob, IJobSkills, skillsLevel } from 'src/common';
import { JobStatus, jobType, Location } from 'src/common/Enum/job.enum';
registerEnumType(Location, { name: 'JobLocation' });
registerEnumType(jobType, { name: 'JobType' });
registerEnumType(JobStatus, { name: 'JobStatus' });
registerEnumType(skillsLevel, { name: 'SkillsLevel' });

@ObjectType({ description: 'Company details' })
export class Company implements ICompany {
  @Field(() => String)
  name: string;
  @Field(() => String, { nullable: true })
  logo?: string;
  @Field(() => String, { nullable: true })
  description?: string;
  @Field(() => String)
  email: string;
  @Field(() => String, { nullable: true })
  website?: string;
  @Field(() => Int)
  adminId: number;
  @Field(() => String, { nullable: true })
  address?: string;
  @Field(() => String, { nullable: true })
  formatAddress?: string;
  @Field(() => Float, { nullable: true })
  latitude?: number;
  @Field(() => Float, { nullable: true })
  longitude?: number;
  @Field(() => Int)
  workTypeId: number;
}

@ObjectType({ description: 'Job Skills' })
export class Skills implements IJobSkills {
  @Field(() => Int)
  skillId: number;
  @Field(() => Int,{nullable:true})
  id: number;
  @Field(() => skillsLevel)
  level: skillsLevel;
  @Field(() => Int)
  jobId: number;
}

@ObjectType({ description: 'Search result for jobs' })
export class JobEntity implements Partial<IJob> {
  @Field(() => Int, { name: 'id' })
  id: number;
  @Field(() => String)
  position: string;
  @Field(() => String, { nullable: true })
  description?: string;
  @Field(() => jobType)
  type: jobType;
  @Field(() => Location)
  location: Location;
  @Field(() => Int)
  companyId: number;
  @Field(() => Int)
  categoryId: number;
  @Field(() => Int)
  maxNumApplication: number;
  @Field(() => Int, { nullable: true })
  applicationCount?: number;
  @Field(() => JobStatus)
  status: JobStatus;
  @Field(() => Company)
  company: Company;
  @Field(() => [Skills])
  skills: Skills[];
}

@ObjectType()
export class JobMeta {
  @Field(() => String, { nullable: true })
  nextCursor?: string;
}
@ObjectType()
export class JobResponse {
  @Field(() => [JobEntity])
  data: JobEntity[];
  @Field(() => JobMeta)
  meta: JobMeta;
}

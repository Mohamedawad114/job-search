import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { JobService } from "./job.service";
import { JobEntity, JobResponse } from './entities/searchJob.entity';
import { Auth, CurrentUser,type IUser, Sys_Role } from "src/common";
import { CreateJobGqlDto, JobDetailsArgs, SearchArgs } from "./dto";




@Auth(Sys_Role.company_admin, Sys_Role.user, Sys_Role.admin)
@Resolver()
export class JobResolver {
  constructor(private readonly jobService: JobService) {}
  @Query(() => JobResponse, { name: 'searchJobs' })
  async searchJobs(@Args() args: SearchArgs) {
    return this.jobService.searchJobs(args, args.limit, args.cursor);
  }
  @Query(() => JobEntity, { name: 'jobDetails' })
  async jobDetails(@Args() args: JobDetailsArgs) {
  const job= this.jobService.getJobDetails(args.jobId);
  return job
  }
  @Auth(Sys_Role.company_admin)
  @Mutation(() => JobEntity, { name: 'createJob' })
  async createJob(
    @Args('input') args: CreateJobGqlDto,
    @CurrentUser() user: IUser,
  ) {
     const res = await this.jobService.createJob(user, args);
     return res;
  }
}
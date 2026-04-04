import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth, CurrentUser, type IUser, Sys_Role } from 'src/common';
import { ApplicationService } from './application.service';
import { JobApplicationsArgs } from './Dto';
import { JobApplicationsResponse } from './entities/job.applications.entity';

@Auth(Sys_Role.company_admin, Sys_Role.user)
@Resolver()
export class ApplicationResolver {
  constructor(private readonly applicationService: ApplicationService) {}
  @Auth(Sys_Role.company_admin)
  @Query(() => JobApplicationsResponse, { name: 'all_job_applications' })
  async jobApplications(
    @Args() args: JobApplicationsArgs,
    @CurrentUser() user: IUser,
  ) {
    return this.applicationService.allJobApplications(
      user,
      args.jobId,
      args?.page,
      args.limit,
    );
  }
}

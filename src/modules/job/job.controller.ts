import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  HttpCode,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Auth, AuthUser, Sys_Role, type IUser } from 'src/common';
import { ChangeStatus, SearchDto } from './dto';
@Auth(Sys_Role.user, Sys_Role.company_admin, Sys_Role.admin)
@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}
  @Auth(Sys_Role.company_admin)
  @Post('add-job')
  createJob(@Body() data: CreateJobDto, @AuthUser() user: IUser) {
    return this.jobService.createJob(user, data);
  }

  @Auth(Sys_Role.company_admin)
  @Put('update-job/:id')
  @HttpCode(200)
  updateJob(
    @Body() data: UpdateJobDto,
    @AuthUser() user: IUser,
    @Param('id') jobId: number,
  ) {
    return this.jobService.updateJob(user, jobId, data);
  }

  @Auth(Sys_Role.company_admin)
  @Patch(':id/change-status')
  changeStatus(
    @Param('id') id: number,
    @AuthUser() user: IUser,
    @Body() status: ChangeStatus,
  ) {
    return this.jobService.changeJobStatus(user, id, status);
  }

  @Get(':id')
  jobDetails(@Param('id') id: number) {
    return this.jobService.getJobDetails(id);
  }
  @Get('/search')
  search(
    @Query() filter: SearchDto,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.jobService.searchJobs(filter, page, limit);
  }

  @Get('/all')
  allJobs(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.jobService.AllJobs(page, limit);
  }
}

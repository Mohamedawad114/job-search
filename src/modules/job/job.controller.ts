import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Put,
  HttpCode,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import {  type IUser } from 'src/common';
import { Sys_Role } from 'src/common/Enum';
import { Auth, AuthUser } from 'src/common/decorator';
import { ChangeStatus, SearchDto } from './dto';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Jobs')
@ApiBearerAuth()
@Auth(Sys_Role.user, Sys_Role.company_admin, Sys_Role.admin)
@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Auth(Sys_Role.company_admin)
  @Post('add-job')
  @ApiOperation({ summary: 'Create a new job' })
  @ApiResponse({ status: 201, description: 'Job created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  createJob(@Body() data: CreateJobDto, @AuthUser() user: IUser) {
    return this.jobService.createJob(user, data);
  }

  @Auth(Sys_Role.company_admin)
  @Put('update-job/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update a job by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Job ID' })
  @ApiResponse({ status: 200, description: 'Job updated successfully' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  updateJob(
    @Body() data: UpdateJobDto,
    @AuthUser() user: IUser,
    @Param('id') jobId: number,
  ) {
    return this.jobService.updateJob(user, jobId, data);
  }

  @Auth(Sys_Role.company_admin)
  @Patch(':id/change-status')
  @ApiOperation({ summary: 'Change job status' })
  @ApiParam({ name: 'id', type: Number, description: 'Job ID' })
  @ApiResponse({ status: 200, description: 'Status changed successfully' })
  changeStatus(
    @Param('id') id: number,
    @AuthUser() user: IUser,
    @Body() status: ChangeStatus,
  ) {
    return this.jobService.changeJobStatus(user, id, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get job details by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Job ID' })
  @ApiResponse({ status: 200, description: 'Job details returned' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  jobDetails(@Param('id') id: number) {
    return this.jobService.getJobDetails(id);
  }

  @Get('/search')
  @ApiOperation({ summary: 'Search jobs with filters' })
  @ApiQuery({ name: 'page', type: Number, required: false, example: 1 })
  @ApiQuery({ name: 'limit', type: Number, required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'Jobs search results' })
  search(
    @Query() filter: SearchDto,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.jobService.searchJobs(filter, page, limit);
  }

  @Get('/all')
  @ApiOperation({ summary: 'Get all jobs with pagination' })
  @ApiQuery({ name: 'page', type: Number, required: false, example: 1 })
  @ApiQuery({ name: 'limit', type: Number, required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'List of all jobs' })
  allJobs(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.jobService.AllJobs(page, limit);
  }
}

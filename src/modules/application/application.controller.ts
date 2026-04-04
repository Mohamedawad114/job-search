import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  Headers,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiHeader,
  ApiBody,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { ApplicationService } from './application.service';
import { type IUser } from 'src/common';
import { Sys_Role } from 'src/common/Enum';
import { Auth, AuthUser } from 'src/common/decorator';
import { applicationStatus, createApplication } from './Dto';

@ApiTags('Applications')
@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}
  @Auth(Sys_Role.user)
  @Post('apply/:jobId')
  @ApiOperation({ summary: 'Apply for a specific job' })
  @ApiHeader({
    name: 'x-idempotency-key',
    description: 'Unique key to prevent duplicate applications',
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'Application created successfully.',
  })
  @ApiResponse({ status: 409, description: 'Application already exists.' })
  async apply(
    @AuthUser() user: IUser,
    @Param('jobId', ParseIntPipe) jobId: number,
    @Body() data: createApplication,
    @Headers('x-idempotency-key') idempotencyKey: string,
  ) {
    return await this.applicationService.apply(
      user,
      jobId,
      data,
      idempotencyKey,
    );
  }
  @Auth(Sys_Role.user)
  @Get('all')
  @ApiOperation({ summary: 'Get all applications for the logged-in user' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'all applications',
  })
  async getUserApplications(
    @AuthUser() user: IUser,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return await this.applicationService.allUserApplications(user, page, limit);
  }
  @Auth(Sys_Role.company_admin)
  @Get('job/:jobId')
  @ApiOperation({
    summary: 'Get all applications for a specific job (Employer Only)',
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiParam({ name: 'jobId', type: Number })
  async getJobApplications(
    @AuthUser() user: IUser,
    @Param('jobId', ParseIntPipe) jobId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    const res = await this.applicationService.allJobApplications(
      user,
      jobId,
      page,
      limit,
    );
    return { message: 'all job applications ', data: res.data, meta: res.meta };
  }
  @Auth(Sys_Role.user, Sys_Role.company_admin)
  @Get(':id')
  @ApiOperation({ summary: 'Get details of a single application ' })
  @ApiParam({ name: 'ids', type: Number })
  async getApplication(
    @AuthUser()
    user: IUser,
    @Param('id', ParseIntPipe) applyId: number,
  ) {
    return await this.applicationService.getSpecApply(user, applyId);
  }
  @Auth(Sys_Role.company_admin)
  @Patch(':jobId/accept')
  @ApiOperation({
    summary: 'accept of applications of spec job  and notify users',
  })
  @ApiBody({ type: applicationStatus })
  @ApiParam({ name: 'jobId', type: Number })
  async acceptApplications(
    @Body() data: applicationStatus,
    @Param('jobId', ParseIntPipe) jobId: number,
    @AuthUser() user: IUser,
  ) {
    return await this.applicationService.acceptApplications(jobId, data, user);
  }
}

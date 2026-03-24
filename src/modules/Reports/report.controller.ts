import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { type IUser } from 'src/common';
import { Sys_Role } from 'src/common/Enum';
import { Auth, AuthUser } from 'src/common/decorator';

import { AIReportsServices } from './report.service';

@ApiTags('AI Reports')
@ApiBearerAuth()
@Auth(Sys_Role.company_admin)
@Controller('ai-reports')
export class AIReportsController {
  constructor(private readonly aiReportsServices: AIReportsServices) {}

  @Get('job/:jobId')
  @ApiOperation({
    summary: 'Get all AI reports for a job',
    description:
      'Returns paginated AI reports for all applications under a specific job. Only accessible by the company admin who owns the job.',
  })
  @ApiParam({ name: 'jobId', type: Number, description: 'Job ID' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiOkResponse({
    description: 'Paginated list of AI reports',
    schema: {
      example: {
        message: 'job reports',
        data: [
          {
            id: 1,
            summary: 'Strong candidate with relevant experience',
            decision: 'ACCEPT',
            application: {
              user: { name: 'John Doe', email: 'john@example.com' },
            },
          },
        ],
        meta: { total: 50, pages: 5 },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Job not found' })
  @ApiForbiddenResponse({ description: 'Not authorized to view these reports' })
  allJobReports(
    @AuthUser() user: IUser,
    @Param('jobId', ParseIntPipe) jobId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.aiReportsServices.allJobReports(user, jobId, page, limit);
  }

  @Get(':reportId')
  @ApiOperation({
    summary: 'Get AI report details',
    description:
      'Returns full details of a specific AI report. Only accessible by the company admin who owns the related job.',
  })
  @ApiParam({ name: 'reportId', type: Number, description: 'Report ID' })
  @ApiOkResponse({
    description: 'AI report details',
    schema: {
      example: {
        message: 'report data',
        data: {
          id: 1,
          ATSScore: 87.5,
          summary: 'Strong candidate',
          strengths: 'Good communication skills',
          weaknesses: 'Lacks leadership experience',
          decision: 'ACCEPT',
          application: {
            job: { companyId: 3 },
          },
        },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Report not found' })
  @ApiForbiddenResponse({ description: 'Not authorized' })
  reportDetails(
    @AuthUser() user: IUser,
    @Param('reportId', ParseIntPipe) reportId: number,
  ) {
    return this.aiReportsServices.reportDetails(user, reportId);
  }

  @Get(':reportId/skills')
  @ApiOperation({
    summary: 'Get skill match analysis for a report',
    description:
      'Returns all skill match scores for a specific AI report. Only accessible by the company admin who owns the related job.',
  })
  @ApiParam({ name: 'reportId', type: Number, description: 'Report ID' })
  @ApiOkResponse({
    description: 'Skill match analysis',
    schema: {
      example: {
        message: 'skill reports',
        data: [
          { id: 1, skillName: 'TypeScript', matchScore: 92.0 },
          { id: 2, skillName: 'NestJS', matchScore: 85.0 },
        ],
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Report not found' })
  @ApiForbiddenResponse({ description: 'Not authorized' })
  skillsReport(
    @AuthUser() user: IUser,
    @Param('reportId', ParseIntPipe) reportId: number,
  ) {
    return this.aiReportsServices.skillsReport(user, reportId);
  }

  @Get(':reportId/full')
  @ApiOperation({
    summary: 'Get AI report with full skill analysis',
    description:
      'Returns the AI report details combined with all skill match scores in a single response.',
  })
  @ApiParam({ name: 'reportId', type: Number, description: 'Report ID' })
  @ApiOkResponse({
    description: 'Report with skill analysis',
    schema: {
      example: {
        message: 'report with skill Analysis',
        data: {
          id: 1,
          ATSScore: 87.5,
          summary: 'Strong candidate',
          strengths: 'Good communication skills',
          weaknesses: 'Lacks leadership experience',
          decision: 'ACCEPT',
          skills: [
            { id: 1, skillName: 'TypeScript', matchScore: 92.0 },
            { id: 2, skillName: 'NestJS', matchScore: 85.0 },
          ],
        },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Report not found' })
  @ApiForbiddenResponse({ description: 'Not authorized' })
  getReportWithSkills(
    @AuthUser() user: IUser,
    @Param('reportId', ParseIntPipe) reportId: number,
  ) {
    return this.aiReportsServices.getReportWithSkills(user, reportId);
  }
}

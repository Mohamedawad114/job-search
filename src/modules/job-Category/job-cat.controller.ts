import {
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { JobCatService } from './job-cat.service';
import { Sys_Role } from 'src/common/Enum';
import { Auth } from 'src/common/decorator';

import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Job Categories')
@ApiBearerAuth()
@Auth(Sys_Role.company_admin, Sys_Role.user)
@Controller('job-category')
export class JobCatController {
  constructor(private readonly jobCatService: JobCatService) {}

  @Get('/all')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all job categories with pagination' })
  @ApiQuery({ name: 'page', type: Number, required: false, example: 1 })
  @ApiQuery({ name: 'limit', type: Number, required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'List of job categories' })
  async getData(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return await this.jobCatService.allCategories(page, limit);
  }

  @Get('/:id/jobs')
  @ApiOperation({ summary: 'Get all jobs for a specific category' })
  @ApiParam({ name: 'id', type: Number, description: 'Category ID' })
  @ApiQuery({ name: 'page', type: Number, required: false, example: 1 })
  @ApiQuery({ name: 'limit', type: Number, required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'List of jobs in category' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async jobsForCat(
    @Param('id') id: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return await this.jobCatService.allCategoryJobs(id, page, limit);
  }
}

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
import { Auth, Sys_Role } from 'src/common';
@Auth(Sys_Role.company_admin, Sys_Role.user)
@Controller('api/job-category')
export class JobCatController {
  constructor(private readonly jobCatService: JobCatService) {}

  @Get('/all')
  @HttpCode(200)
  getData(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.jobCatService.allCategories(page, limit);
  }
  @Get('/:id/all-jobs')
  jobsForCat(
    @Param('id') id: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.jobCatService.allCategoryJobs(id, page, limit);
  }
}

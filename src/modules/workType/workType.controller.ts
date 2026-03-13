import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { Auth, Sys_Role } from 'src/common';
import { WorkTypeService } from './workType.service';
@Auth(Sys_Role.user, Sys_Role.admin, Sys_Role.company_admin)
@Controller('category')
export class WorkTypeController {
  constructor(private readonly workTypeService: WorkTypeService) {}

  @Get('/all')
  AllWorkCategory(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.workTypeService.workCategories(page, limit);
  }
  @Get('/:id/companies')
  AllCompaniesCategory(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Param('id') workTypeId: number,
  ) {
    return this.workTypeService.companies_forType(workTypeId, page, limit);
  }
}

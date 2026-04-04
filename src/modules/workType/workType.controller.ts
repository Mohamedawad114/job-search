import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { Sys_Role } from 'src/common/Enum';
import { Auth } from 'src/common/decorator';
import { WorkTypeService } from './workType.service';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Work Types')
@ApiBearerAuth()
@Auth(Sys_Role.user, Sys_Role.admin, Sys_Role.company_admin)
@Controller('workType')
export class WorkTypeController {
  constructor(private readonly workTypeService: WorkTypeService) {}

  @Get('/all')
  @ApiOperation({ summary: 'Get all work categories with pagination' })
  @ApiQuery({ name: 'page', type: Number, required: false, example: 1 })
  @ApiQuery({ name: 'limit', type: Number, required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'List of work categories' })
  async AllWorkCategory(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return await this.workTypeService.workCategories(page, limit);
  }

  @Get('/:id/companies')
  @ApiOperation({ summary: 'Get all companies for a specific work type' })
  @ApiParam({ name: 'id', type: Number, description: 'Work type ID' })
  @ApiQuery({ name: 'page', type: Number, required: false, example: 1 })
  @ApiQuery({ name: 'limit', type: Number, required: false, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'List of companies for this category',
  })
  @ApiResponse({ status: 404, description: 'Work type not found' })
  async AllCompaniesCategory(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Param('id') workTypeId: number,
  ) {
    return await this.workTypeService.companies_forType(workTypeId, page, limit);
  }
}

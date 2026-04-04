import {
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { type IUser } from 'src/common';
import { Sys_Role } from 'src/common/Enum';
import { Auth, AuthUser } from 'src/common/decorator';
import { CompanyService } from './company.service';
import {
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
@ApiTags('company')
@Auth(Sys_Role.company_admin, Sys_Role.user, Sys_Role.admin)
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}
  @Get('/:id/jobs')
  @ApiOperation({ summary: 'Get company jobs' })
  @ApiParam({ name: 'id', type: Number, description: 'Company Id' })
  @ApiQuery({ name: 'page', type: Number, description: 'Page number' })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'Number of items per page',
  })
  @ApiResponse({
    status: 200,
    description: 'Company jobs retrieved successfully',
  })
  @ApiNotFoundResponse({ description: 'company not found' })
  companyJobs(
    @Param('id', ParseIntPipe) companyId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.companyService.companyJobs(companyId, page, limit);
  }
  @Get('/search')
  @HttpCode(200)
  @ApiOperation({ summary: 'search company by name or description ' })
  @ApiQuery({ name: 'search', type: String, description: 'search term' })
  @ApiQuery({ name: 'page', type: Number, description: 'Page number' })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'Number of items per page',
  })
  @ApiResponse({ status: 200, description: 'Companies found' })
  @ApiNotFoundResponse({ description: 'company not found' })
  async search(
    @Query('search') search: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return await this.companyService.search(search, page, limit);
  }
  @Get('/all')
  @HttpCode(200)
  @ApiOperation({ summary: 'get all companies ' })
  @ApiQuery({ name: 'page', type: Number, description: 'Page number' })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'Number of items per page',
  })
  @ApiResponse({ status: 200, description: 'Companies retrieved successfully' })
  async allCompanies(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return await this.companyService.getAllCompanies(page, limit);
  }
  @Get('/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get company profile' })
  @ApiResponse({
    status: 200,
    description: 'Company profile retrieved successfully',
  })
  @ApiNotFoundResponse({ description: 'company not found' })
  async companyProfile(
    @Param('id', ParseIntPipe) companyId: number,
    @AuthUser() user: IUser,
  ) {
    return this.companyService.getCompanyProfile(user, companyId);
  }
}

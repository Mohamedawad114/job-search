import { Body, Controller, HttpCode, Patch, Post, Put } from '@nestjs/common';
import { Auth, AuthUser, type IUser, Sys_Role } from 'src/common';
import { CompanyService } from './company.service';
import {
  ChangeAdminCompany,
  CreateCompanyDto,
  UpdateCompanyDto,
  UploadDto,
} from './Dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

@Auth(Sys_Role.company_admin)
@Controller('api/admin/company')
export class AdminCompanyController {
  constructor(private readonly companyService: CompanyService) {}
  @Auth(Sys_Role.user)
  @Post('/create')
  @ApiOperation({ summary: 'create company account' })
  @ApiBody({ type: CreateCompanyDto })
  @ApiResponse({
    status: 200,
    description: 'Company account created',
  })
  @ApiBadRequestResponse({ description: 'work Type not exist' })
  createCompany(@Body() data: CreateCompanyDto, @AuthUser() user: IUser) {
    return this.companyService.createCompanyAccount(data, user);
  }
  @Put('/update')
  @HttpCode(200)
  @ApiOperation({ summary: 'update company account' })
  @ApiBody({ type: UpdateCompanyDto })
  @ApiResponse({
    status: 200,
    description: 'Company account updated',
  })
  @ApiBadRequestResponse({ description: 'work Type not exist' })
  updateCompany(@Body() data: UpdateCompanyDto, @AuthUser() user: IUser) {
    return this.companyService.updateCompany(user, data);
  }
  @Patch('/update-logo')
  @HttpCode(200)
  updateCompanyLogo(@Body() data: UploadDto, @AuthUser() user: IUser) {
    return this.companyService.updateUpload(data, user);
  }
  @Patch('/change-admin')
  @HttpCode(200)
  @ApiOperation({ summary: 'change company admin' })
  @ApiBody({ type: ChangeAdminCompany })
  @ApiResponse({
    status: 200,
    description: 'admin change',
  })
  @ApiNotFoundResponse({
    description: "no company found or you're not a company admin",
  })
  changeAdmin(@Body() data: ChangeAdminCompany, @AuthUser() user: IUser) {
    return this.companyService.changeAdmin(user, data);
  }
}

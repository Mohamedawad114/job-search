import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { type IUser } from 'src/common';
import { Sys_Role } from 'src/common/Enum';
import { Auth, AuthUser } from 'src/common/decorator';
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
  ApiResponse,
} from '@nestjs/swagger';

@Auth(Sys_Role.company_admin)
@Controller('admin/company')
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
  @Get('/upload-logo')
  @HttpCode(200)
  @ApiOperation({ summary: 'get url for upload logo' })
  uploadLogo(@AuthUser() user: IUser) {
    return this.companyService.getUploadUrl(user);
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
  @ApiOperation({ summary: 'update  logo' })
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

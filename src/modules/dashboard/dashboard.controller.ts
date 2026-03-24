import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { type IUser } from 'src/common';
import { Sys_Role } from 'src/common/Enum';
import { Auth, AuthUser }from 'src/common/decorator'
import {
  changeRoleDto,
  CreateJobCatDto,
  CreateSkillDto,
  CreateWorkTypeDto,
  DataFilterDto,
  UpdateJobCat,
} from './Dto';
import { UserDashboard } from './dashboardUser.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
@ApiTags('Dashboard')
@Auth(Sys_Role.admin)
@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly userDashboard: UserDashboard,
  ) {}

  @Post('/add-Skill')
  @ApiOperation({ summary: 'add skill ' })
  @ApiBody({ type: CreateSkillDto })
  @ApiResponse({ status: 201, example: 'skill is added' })
  @HttpCode(201)
  addSkill(@AuthUser() user: IUser, @Body() data: CreateSkillDto) {
    return this.dashboardService.addSkills(user, data);
  }
  @Post('/add-jobCategory')
  @ApiOperation({ summary: 'add job category ' })
  @ApiBody({ type: CreateJobCatDto })
  @ApiResponse({ status: 201, example: 'job category is added' })
  @HttpCode(201)
  addJobCategory(@AuthUser() user: IUser, @Body() data: CreateJobCatDto) {
    return this.dashboardService.addJobCat(data);
  }
  @HttpCode(201)
  @Post('/add-workType')
  @ApiOperation({ summary: 'add work type for companies' })
  @ApiBody({ type: CreateWorkTypeDto })
  @ApiResponse({ status: 201, example: 'work type is added' })
  addWorkType(@AuthUser() user: IUser, @Body() data: CreateWorkTypeDto) {
    return this.dashboardService.addWorkType(user, data);
  }
  @Delete('/skill')
  @ApiOperation({ summary: 'delete skill ' })
  @ApiQuery({ name: 'skillId', type: Number, description: 'Skill Id' })
  @ApiResponse({ status: 200, example: 'skill is deleted' })
  deleteSkill(@Query('skillId', ParseIntPipe) skillId: number) {
    return this.dashboardService.deleteSkill(skillId);
  }
  @Delete('/jobCategory')
  @ApiOperation({ summary: 'delete job category ' })
  @ApiQuery({ name: 'jobCatId', type: Number, description: 'Job Category Id' })
  @ApiResponse({ status: 200, example: 'job category is deleted' })
  deleteJobCategory(@Query('jobCatId', ParseIntPipe) jobCatId: number) {
    return this.dashboardService.deleteJobCat(jobCatId);
  }
  @Delete('/workType')
  @ApiOperation({ summary: 'delete work type ' })
  @ApiQuery({ name: 'workTypeId', type: Number, description: 'Work Type Id' })
  @ApiResponse({ status: 200, example: 'work type is deleted' })
  deleteWorkType(@Query('workTypeId', ParseIntPipe) workTypeId: number) {
    return this.dashboardService.deleteWorkType(workTypeId);
  }
  @Put('/jobCategory/:id')
  @ApiOperation({ summary: 'update information of job category ' })
  @ApiBody({ type: UpdateJobCat })
  @ApiResponse({ status: 200, example: 'job category is updated' })
  @HttpCode(200)
  updateJobCat(
    @Param('id', ParseIntPipe) workTypeId: number,
    @Body() data: UpdateJobCat,
  ) {
    return this.dashboardService.updateJobCat(data, workTypeId);
  }
  @Get('/data')
  @HttpCode(200)
  @ApiOperation({ summary: 'get data' })
  @ApiQuery({
    'x-enumNames': ['skills', 'jobCategory,', 'workType'],
    type: String,
  })
  @ApiQuery({ name: 'page', type: Number })
  @ApiQuery({ name: 'limit', type: Number })
  getData(
    @Query() type: DataFilterDto,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.dashboardService.finds(page, limit, type);
  }
  @Get('/banned-users')
  @HttpCode(200)
  @ApiOperation({ summary: 'get banned user' })
  @ApiQuery({ name: 'page', type: Number })
  @ApiQuery({ name: 'limit', type: Number })
  getBannedUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.userDashboard.BannedUsers(page, limit);
  }
  @ApiOperation({ summary: 'Ban a user by Id' })
  @ApiParam({ name: 'id', type: Number, description: 'User Id' })
  @Patch('ban-user/:id')
  @HttpCode(200)
  BanUser(@Param('id',ParseIntPipe) userId: number) {
    return this.userDashboard.BanUser(userId);
  }

  @ApiOperation({ summary: 'Un ban  user by Id' })
  @ApiParam({ name: 'id', type: Number, description: 'User Id' })
  @Patch('unban-user/:id')
  @HttpCode(200)
  unBanUser(@Param('id',ParseIntPipe) userId: number) {
    return this.userDashboard.unBanUser(userId);
  }
  @Patch('change-role/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'change role  user by Id' })
  @ApiParam({ name: 'id', type: Number, description: 'User Id' })
  @ApiBody({ type: changeRoleDto })
  changeRole(
    @Param('id', ParseIntPipe) userId: number,
    @Body() data: changeRoleDto,
  ) {
    return this.userDashboard.changeRole(userId, data);
  }
}

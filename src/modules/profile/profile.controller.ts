import {
  Controller,
  Get,
  Put,
  Body,
  Post,
  HttpCode,
  Delete,
  Query,
  ParseIntPipe,
  Patch,
  Param,
} from '@nestjs/common';
import { Sys_Role } from 'src/common/Enum';
import { type IUser } from 'src/common';
import { Auth, AuthUser }from 'src/common/decorator'
import { ProfileServices } from './profile.service';
import {
  AddEducationDto,
  AddExperienceDto,
  AddUserSkill,
  updateEducationDto,
  UpdateExperienceDto,
  UpdateProfileDto,
  UpdateUserSkill,
} from './Dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('user profile')
@Auth(Sys_Role.admin, Sys_Role.admin, Sys_Role.company_admin)
@Controller('Profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileServices) {}

  @Get('')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile fetched successfully',
  })
  getProfile(@AuthUser() user: IUser) {
    return this.profileService.getProfile(user);
  }
  @Get('profile-picture')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get  profile picture data (signed URL)' })
  profilePicture(@AuthUser() user: IUser) {
    return this.profileService.getProfilePic(user);
  }

  @Put('update')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update user profile data' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  updateProfile(@AuthUser() user: IUser, @Body() dto: UpdateProfileDto) {
    return this.profileService.updateProfile(dto, user);
  }

  @Post('add-education')
  @ApiOperation({ summary: 'add eduction in user profile' })
  @ApiBody({ type: AddEducationDto })
  @ApiResponse({ status: 201, description: 'user education added' })
  @ApiBadRequestResponse({ description: 'enter a correct date' })
  addEdu(@Body() Dto: AddEducationDto, @AuthUser() user: IUser) {
    return this.profileService.addEducation(user, Dto);
  }
  @Put('update-education')
  @HttpCode(200)
  @ApiOperation({ summary: 'update user eduction information' })
  @ApiBody({ type: updateEducationDto })
  @ApiResponse({ status: 200, description: 'user education updated' })
  @ApiNotFoundResponse({ description: 'user education not exist' })
  UpdateEdu(@Body() Dto: updateEducationDto, @AuthUser() user: IUser) {
    return this.profileService.updateEducation(user, Dto);
  }
  @Delete('delete-education')
  @ApiOperation({ summary: 'delete user education' })
  @ApiResponse({ status: 200, description: 'education deleted' })
  @ApiNotFoundResponse({ description: 'user education not exist' })
  deleteEdu(@AuthUser() user: IUser) {
    return this.profileService.deleteEducation(user);
  }
  @Post('add-experience')
  @ApiOperation({ summary: 'add experience in user profile' })
  @ApiBody({ type: AddExperienceDto })
  @ApiResponse({ status: 201, description: 'user experience added' })
  @ApiBadRequestResponse({ description: 'enter a correct date' })
  addExp(@Body() Dto: AddExperienceDto, @AuthUser() user: IUser) {
    return this.profileService.addExperience(user, Dto);
  }
  @Put('update-experience/:experienceId')
  @ApiOperation({ summary: 'update user experience information' })
  @ApiBody({ type: UpdateExperienceDto })
  @ApiQuery({ name: 'experienceId', type: Number })
  @ApiResponse({ status: 200, description: 'user experience updated' })
  @ApiNotFoundResponse({ description: 'user experience not exist' })
  updateExp(
    @Body() Dto: UpdateExperienceDto,
    @AuthUser() user: IUser,
    @Param('experienceId', ParseIntPipe) expId: number,
  ) {
    return this.profileService.updateExperience(user, Dto, expId);
  }
  @Delete('delete-experience/:experienceId')
  @ApiOperation({ summary: 'delete user experience' })
  @ApiQuery({ name: 'experienceId', type: Number })
  @ApiResponse({ status: 200, description: 'experience deleted' })
  deleteExp(
    @Param('experienceId', ParseIntPipe) expId: number,
    @AuthUser() user: IUser,
  ) {
    return this.profileService.deleteExperience(user, expId);
  }
  @Post('add-skill')
  @ApiOperation({ summary: 'add skill to user profile' })
  @ApiBody({ type: AddUserSkill })
  @ApiResponse({ status: 201, description: 'user skill added' })
  @ApiConflictResponse({ description: 'skill is already exist ' })
  addUserSkill(@Body() Dto: AddUserSkill, @AuthUser() user: IUser) {
    return this.profileService.addUserSkill(user, Dto);
  }
  @Patch('update-skill')
  @ApiOperation({ summary: 'update user skill information' })
  @ApiBody({ type: UpdateUserSkill })
  @ApiQuery({ name: 'skillId', type: Number })
  @ApiResponse({ status: 200, description: 'user skill updated' })
  @ApiNotFoundResponse({ description: 'user skill not exist' })
  updateUserSkill(
    @Query('skillId', ParseIntPipe) skillId: number,
    @Body() Dto: UpdateUserSkill,
    @AuthUser() user: IUser,
  ) {
    return this.profileService.updateUserSkill(user, Dto, skillId);
  }
  @Delete('delete-skill')
  @ApiOperation({ summary: 'delete user skill' })
  @ApiQuery({ name: 'skillId', type: Number })
  deleteUserSkill(
    @AuthUser() user: IUser,
    @Query('skillId', ParseIntPipe) skillId: number,
  ) {
    return this.profileService.deleteUserSkill(user, skillId);
  }
}

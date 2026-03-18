import {
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { SavedJobService } from './savedJobs.service';
import { type IUser } from 'src/common';
import { Sys_Role } from 'src/common/Enum';
import { Auth, AuthUser } from 'src/common/decorator';

import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Saved Jobs')
@ApiBearerAuth()
@Auth(Sys_Role.user, Sys_Role.company_admin)
@Controller('api/saved-jobs')
export class SavedJobController {
  constructor(private readonly savedJobService: SavedJobService) {}

  @Post('save/:id')
  @ApiOperation({ summary: 'Save a job for the authenticated user' })
  @ApiParam({ name: 'id', type: Number, description: 'Job ID to save' })
  @ApiResponse({ status: 201, description: 'Job saved successfully' })
  saveJob(@Param('id') jobId: number, @AuthUser() user: IUser) {
    return this.savedJobService.addToSavedJobs(jobId, user);
  }

  @Get('saved-jobs')
  @ApiOperation({ summary: 'Get saved jobs for the authenticated user' })
  @ApiQuery({ name: 'page', type: Number, required: false, example: 1 })
  @ApiQuery({ name: 'limit', type: Number, required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'List of saved jobs' })
  savedJobs(
    @AuthUser() user: IUser,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.savedJobService.mySavedJobs(user, page, limit);
  }

  @Delete('save/:id')
  @ApiOperation({ summary: 'Remove a saved job for the authenticated user' })
  @ApiParam({ name: 'id', type: Number, description: 'Job ID to remove' })
  @ApiResponse({ status: 200, description: 'Job removed from saved jobs' })
  deleteSavedJob(@Param('id') jobId: number, @AuthUser() user: IUser) {
    return this.savedJobService.removeFromSavedJobs(jobId, user);
  }
}

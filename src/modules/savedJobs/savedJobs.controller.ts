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
import { Auth, AuthUser, Sys_Role, type IUser } from 'src/common';

@Auth(Sys_Role.user, Sys_Role.company_admin)
@Controller('api/saved-jobs')
export class SavedJobController {
  constructor(private readonly savedJobService: SavedJobService) {}
  @Post('save/:id')
  saveJob(@Param('id') jobId: number, @AuthUser() user: IUser) {
    return this.savedJobService.addToSavedJobs(jobId, user);
  }
  @Get('saved-jobs')
  savedJobs(
    @AuthUser() user: IUser,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.savedJobService.mySavedJobs(user, page, limit);
  }
  @Delete('save/:id')
  deleteSavedJob(@Param('id') jobId: number, @AuthUser() user: IUser) {
    return this.savedJobService.removeFromSavedJobs(jobId, user);
  }
}

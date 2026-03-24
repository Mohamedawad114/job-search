import {
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { Sys_Role, type IUser } from 'src/common';
import { Auth, AuthUser } from 'src/common/decorator';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { NotificationsServices } from './notification.service';

@ApiTags('Notifications')
@Auth(Sys_Role.user, Sys_Role.admin, Sys_Role.company_admin)
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationsServices) {}

  @ApiOperation({ summary: 'Get unread notifications for the logged-in user' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @HttpCode(200)
  @Get('unread')
  unReadNotifications(
    @AuthUser() user: IUser,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.notificationService.unReadNotifications(user, page, limit);
  }

  @ApiOperation({ summary: 'Get read notifications for the logged-in user' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @HttpCode(200)
  @Get('/')
  readNotifications(
    @AuthUser() user: IUser,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.notificationService.allReadNotifications(user, page, limit);
  }

  @ApiOperation({ summary: 'Delete all notifications for the logged-in user' })
  @HttpCode(200)
  @Delete('delete')
  deleteNotifications(@AuthUser() user: IUser) {
    return this.notificationService.delete_Notifications(user);
  }
}

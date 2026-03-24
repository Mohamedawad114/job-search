import {
  Controller,
  Post,
  Body,
  Delete,
  Get,
  Param,
  Patch,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import { ChatService } from './chat.service';
import { Auth, AuthUser, Sys_Role, type IUser } from 'src/common';
import { CreateGroup } from './Dto';

@ApiTags('Conversations')
@ApiBearerAuth()
@Auth(Sys_Role.user, Sys_Role.company_admin)
@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ChatService) {}

  @Auth(Sys_Role.company_admin)
  @Post('group')
  @ApiOperation({ summary: 'Create a new group conversation' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Group created successfully.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Group name already exists.',
  })
  async createGroup(@AuthUser() user: IUser, @Body() data: CreateGroup) {
    return await this.conversationService.CreateGroupConversation(user, data);
  }

  @Patch('group/:groupId/add-member/:userId')
  @ApiOperation({ summary: 'Add a member to a group (Admin only)' })
  @ApiParam({
    name: 'groupId',
    type: String,
    description: 'The Object ID of the group',
  })
  @ApiParam({
    name: 'userId',
    type: Number,
    description: 'The ID of the user to add',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Member added successfully.',
  })
  @ApiNotFoundResponse({
    example: 'Group or User not found.',
  })
  async addMember(
    @Param('groupId') groupId: Types.ObjectId,
    @Param('userId', ParseIntPipe) userId: number,
    @AuthUser() user: IUser,
  ) {
    return await this.conversationService.AddMemberToGroup(
      userId,
      groupId,
      user,
    );
  }

  @Delete('group/:groupId/remove-member/:userId')
  @ApiOperation({ summary: 'Remove a member from a group (Admin only)' })
  @ApiParam({ name: 'groupId', type: String })
  @ApiParam({ name: 'userId', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User removed successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Group not found or unauthorized.',
  })
  async removeMember(
    @Param('userId', ParseIntPipe) userId: number,
    @AuthUser() user: IUser,
    @Param('groupId') groupId: Types.ObjectId,
  ) {
    return await this.conversationService.removeMember(userId, user, groupId);
  }

  @Get('group/:groupId/info')
  @ApiOperation({ summary: 'Get specific group details' })
  @ApiParam({ name: 'groupId', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Group info retrieved.' })
  @ApiNotFoundResponse({
    description: 'Group not found.',
  })
  async getGroupInfo(
    @AuthUser() user: IUser,
    @Param('groupId') groupId: Types.ObjectId,
  ) {
    return await this.conversationService.groupInfo(user, groupId);
  }

  @Get('my-chats')
  @ApiOperation({ summary: 'List all chats for the authenticated user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns an array of chats.',
  })
  async listUserChats(@AuthUser() user: IUser) {
    return await this.conversationService.listUserChats(user);
  }
}

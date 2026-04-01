import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import {
  ConversionRepository,
  conversionType,
  decoderCursor,
  encoderCursor,
  IUser,
  MessageRepository,
  UserRepository,
} from 'src/common';
import { CreateGroup } from './Dto';

@Injectable()
export class ChatService {
  constructor(
    private readonly conversionRepo: ConversionRepository,
    private readonly messageRepo: MessageRepository,
    private readonly userRepo: UserRepository,
  ) {}
  async getUserConversations(userId: number) {
    const conversations = await this.conversionRepo.findDocuments(
      {
        memberIds: userId,
      },
      {
        _id: 1,
      },
    );
    return conversations;
  }
  async markMessagesAsRead(conversionId: Types.ObjectId, userId: number) {
    return await this.messageRepo.updateManyDocuments(
      {
        conversionId,
        senderId: { $ne: userId },
        isRead: false,
      },
      { isRead: true },
    );
  }
  async CreateGroupConversation(user: IUser, data: CreateGroup) {
    const conversation = await this.conversionRepo.findOneDocument({
      name: data.name,
      adminId: user.id,
      type: conversionType.group,
    });
    if (conversation) throw new ConflictException('group name is exists');
    data.memberIds = [...data.memberIds, user.id];
    const group = await this.conversionRepo.create({
      ...data,
      adminId: user.id,
      type: conversionType.group,
    });
    return {
      message: 'group created',
      data: group,
    };
  }
  async AddMemberToGroup(userId: number, groupId: Types.ObjectId, user: IUser) {
    const group = await this.conversionRepo.findOneDocument({
      _id: groupId,
      adminId: user.id,
      type: conversionType.group,
    });
    if (!group) throw new NotFoundException('group not found');
    const userFound = await this.userRepo.findById(userId);
    if (!userFound) throw new NotFoundException('user not found');
    const updated = await this.conversionRepo.updateDocument(
      { adminId: user.id, _id: groupId },
      { $push: { memberIds: userId } },
    );
  }
  async removeMember(userId: number, user: IUser, groupId: Types.ObjectId) {
    const conversation = await this.conversionRepo.findOneDocument({
      adminId: user.id,
      _id: groupId,
      type: conversionType.group,
    });
    if (!conversation)
      throw new NotFoundException('group not exist| you are not admin');
    if (!conversation.memberIds.includes(userId))
      return { message: `user not in your group` };
    const group = await this.conversionRepo.updateDocument(
      { _id: groupId },
      {
        $pull: { memberIds: userId },
      },
    );
    return {
      message: 'user removed ',
    };
  }
  groupInfo = async (user: IUser, groupId: Types.ObjectId) => {
    const groupInfo = await this.conversionRepo.findOneDocument(
      { $in: [user.id], _id: groupId },
      { name: 1, memberIds: 1, createdAt: -1 },
    );
    if (!groupInfo) throw new NotFoundException('group not found');
    return {
      message: 'group info',
      data: groupInfo,
    };
  };
  listUserChats = async (user: IUser, limit: number, cursor: string) => {
    const decodedCursor = decoderCursor(cursor);
    const filter: any = {
      memberIds: user.id,
    };
    if (decodedCursor) {
      filter.$or = [
        { createdAt: { $lt: decodedCursor.createdAt } },
        {
          createdAt: decodedCursor.createdAt,
          _id: { $lt: decodedCursor._id },
        },
      ];
    }
    const chats = await this.conversionRepo.findDocuments(
      filter,
      { name: 1, createdAt: 1 },
      {
        limit: limit,
        sort: { createdAt: -1, id: -1 },
      },
    );
    const lastItem = chats[chats.length - 1];
    const nextCursor = encoderCursor(lastItem.id, lastItem.createdAt);
    if (!chats.length) return [];
    return {
      message: 'chats',
      data: chats,
      meta: { nextCursor: nextCursor },
    };
  };
  async getOrCreatePrivateConversation(userId: number, targetUserId: number) {
    let conversation = await this.conversionRepo.findOneDocument({
      memberIds: { $all: [userId, targetUserId] },
      type: conversionType.private,
    });
    if (!conversation) {
      conversation = await this.conversionRepo.create({
        type: conversionType.private,
        memberIds: [userId, targetUserId],
      });
    }

    return conversation;
  }

  async getGroupConversation(groupId: string | Types.ObjectId) {
    const conversation = await this.conversionRepo.findOneDocument({
      _id: groupId,
      type: conversionType.group,
    });
    if (!conversation) throw new NotFoundException('Group not found');
    return conversation;
  }
  async isUserInGroup(
    userId: number,
    groupId: Types.ObjectId,
  ): Promise<boolean> {
    const group = await this.conversionRepo.findOneDocument({
      _id: new Types.ObjectId(groupId),
      memberIds: { $in: [userId] },
      type: conversionType.group,
    });
    return !!group;
  }

  async saveMessage(
    conversionId: Types.ObjectId,
    senderId: number,
    text: string,
  ) {
    return await this.messageRepo.create({
      conversionId: conversionId,
      senderId,
      content: text,
    });
  }

  async getConversationMessages(
    conversionId: string,
    cursor: string,
    limit?: number,
  ) {
    const decodedCursor = decoderCursor(cursor);
    const filter: any = {
      conversionId: new Types.ObjectId(conversionId),
    };
    if (decodedCursor) {
      filter.$or = [
        { createdAt: { $lt: decodedCursor.createdAt } },
        {
          createdAt: decodedCursor.createdAt,
          _id: { $lt: decodedCursor._id },
        },
      ];
    }
    const chatMessages = await this.messageRepo.findDocuments(
      filter,
      {},
      {
        limit: limit,
        sort: { createdAt: -1, _id: -1 },
      },
    );
      if (!chatMessages.length) {
        return { messages: [], meta: { nextCursor: null } };
      }
    const lastItem = chatMessages[chatMessages.length - 1];
    const nextCursor = encoderCursor(
      lastItem._id.toString(),
      lastItem.createdAt,
    );
    return { messages: chatMessages, meta: { nextCursor: nextCursor } };
  }
}

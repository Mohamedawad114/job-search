import { Module } from '@nestjs/common';

import {
  ConversionRepository,
  MessageRepository,
  UserRepository,
} from 'src/common/Repositories';
import { ChatGateway } from './chat.gateway';
import { conversionModel, MessageModel } from 'src/common/DB';
import { ConversationController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [conversionModel, MessageModel],
  exports: [ChatGateway],
  providers: [
    ChatGateway,
    UserRepository,
    ChatService,
    ConversionRepository,
    MessageRepository,
  ],
  controllers: [ConversationController],
})
export class ChatModule {}
